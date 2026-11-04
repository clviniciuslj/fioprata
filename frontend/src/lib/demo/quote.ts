import { isUF, type ApiError, type CartItemInput, type CartQuote, type CartQuoteLine, type CartQuoteRequest } from "@/lib/api/contract";
import { MAX_LINE_QTY, MAX_LINES } from "@/lib/cart/cart";
import { findVariant } from "./catalog";
import { demoShippingRule } from "./catalog-data";
import { computeShippingCents } from "./shipping";

/** Soma linhas da mesma variação: o estoque é conferido pelo total, nunca linha a linha. */
function mergeItems(items: CartItemInput[]): CartItemInput[] {
  const merged = new Map<string, number>();
  for (const item of items) merged.set(item.variantId, (merged.get(item.variantId) ?? 0) + item.quantity);
  return [...merged].map(([variantId, quantity]) => ({ variantId, quantity }));
}

/** Recalcula o carrinho com preços e estoque do servidor; nada vindo do navegador é confiado além de ids e quantidades. */
export function quoteCart(req: CartQuoteRequest): CartQuote {
  const lines: CartQuoteLine[] = [];
  const removedVariantIds: string[] = [];

  for (const item of mergeItems(req.items)) {
    const found = findVariant(item.variantId);
    if (!found) {
      removedVariantIds.push(item.variantId);
      continue;
    }
    const { product, variant } = found;
    const issue = variant.available <= 0 ? "unavailable" : item.quantity > variant.available ? "insufficient" : null;
    lines.push({
      variantId: variant.id,
      productSlug: product.slug,
      productName: product.name,
      variantLabel: variant.label,
      image: product.images[0] ?? null,
      unitPriceCents: variant.priceCents,
      quantity: item.quantity,
      available: Math.max(0, variant.available),
      lineTotalCents: issue === "unavailable" ? 0 : variant.priceCents * item.quantity,
      issue,
    });
  }

  const subtotalCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
  const rule = demoShippingRule;
  const shippingCents = lines.length > 0 ? computeShippingCents(rule, req.state, subtotalCents) : null;
  const freeShippingRemainingCents =
    rule.freeAboveCents === null ? null : Math.max(0, rule.freeAboveCents - subtotalCents);

  return {
    lines,
    removedVariantIds,
    subtotalCents,
    shippingCents,
    freeShippingRemainingCents,
    totalCents: subtotalCents + (shippingCents ?? 0),
    hasIssues: lines.some((l) => l.issue !== null),
  };
}

type Parsed<T> = { ok: true; value: T } | { ok: false; error: ApiError };

export function parseCartItems(raw: unknown): Parsed<CartItemInput[]> {
  const invalid = (detail: string): Parsed<CartItemInput[]> => ({
    ok: false,
    error: { title: "Itens do carrinho inválidos.", errors: { items: [detail] } },
  });
  if (!Array.isArray(raw)) return invalid("Informe a lista de itens.");
  if (raw.length > MAX_LINES) return invalid(`O carrinho aceita até ${MAX_LINES} itens.`);
  const items: CartItemInput[] = [];
  for (const entry of raw) {
    const { variantId, quantity } = (entry ?? {}) as Record<string, unknown>;
    if (typeof variantId !== "string" || variantId.length === 0 || variantId.length > 64) return invalid("Item sem variação válida.");
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_LINE_QTY) {
      return invalid(`A quantidade de cada item deve ficar entre 1 e ${MAX_LINE_QTY}.`);
    }
    items.push({ variantId, quantity });
  }
  const merged = mergeItems(items);
  if (merged.some((i) => i.quantity > MAX_LINE_QTY)) {
    return invalid(`A quantidade de cada item deve ficar entre 1 e ${MAX_LINE_QTY}.`);
  }
  return { ok: true, value: merged };
}

export function parseCartQuoteRequest(body: unknown): Parsed<CartQuoteRequest> {
  if (!body || typeof body !== "object") return { ok: false, error: { title: "Corpo da requisição inválido." } };
  const { items, state } = body as Record<string, unknown>;
  const parsedItems = parseCartItems(items);
  if (!parsedItems.ok) return parsedItems;
  if (state !== undefined && !isUF(state)) {
    return { ok: false, error: { title: "Estado inválido.", errors: { state: ["Escolha um estado da lista."] } } };
  }
  return { ok: true, value: state === undefined ? { items: parsedItems.value } : { items: parsedItems.value, state } };
}
