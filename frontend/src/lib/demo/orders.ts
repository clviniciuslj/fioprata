import type { Address, ApiError, CreateOrderRequest, OrderDetail, OrderSummary } from "@/lib/api/contract";
import { validateAddress } from "@/lib/validation";
import { findVariant } from "./catalog";
import { demoShippingRule } from "./catalog-data";
import { quoteCart } from "./quote";
import { computeShippingCents } from "./shipping";
import { demoStore, type DemoOrder } from "./store";

/**
 * Pedidos de demonstração. Nenhum pagamento é simulado: todo pedido nasce e permanece
 * "aguardando pagamento". O estoque de demonstração não é baixado (não há banco de dados);
 * a reserva atômica com expiração é responsabilidade do backend.
 */

export const RESERVATION_MINUTES = 30;

type CreateResult = { ok: true; order: OrderDetail } | { ok: false; status: 400 | 409; error: ApiError };

function normalizeAddress(a: Address): Address {
  const complement = a.complement?.trim();
  return {
    recipient: a.recipient.trim(),
    postalCode: a.postalCode.replace(/\D/g, ""),
    street: a.street.trim(),
    number: a.number.trim(),
    ...(complement ? { complement } : {}),
    district: a.district.trim(),
    city: a.city.trim(),
    state: a.state,
  };
}

function toPublic(order: DemoOrder): OrderDetail {
  const { customerId, ...rest } = order;
  void customerId;
  return rest;
}

export function createDemoOrder(
  customerId: string,
  req: CreateOrderRequest,
  idempotencyKey: string,
  now: Date = new Date(),
): CreateResult {
  // Mesma tentativa (duplo clique, nova tentativa após falha de rede): devolve o pedido já criado.
  const scopedKey = `${customerId}:${idempotencyKey}`;
  const existingNumber = demoStore.idempotency.get(scopedKey);
  const existing = existingNumber ? demoStore.orders.get(existingNumber) : undefined;
  if (existing) return { ok: true, order: toPublic(existing) };

  if (req.items.length === 0) return { ok: false, status: 400, error: { title: "O carrinho está vazio." } };

  const address = normalizeAddress(req.address);
  const addressErrors = validateAddress(address);
  if (Object.keys(addressErrors).length > 0) {
    const errors = Object.fromEntries(Object.entries(addressErrors).map(([field, message]) => [field, [message as string]]));
    return { ok: false, status: 400, error: { title: "Revise o endereço de entrega.", errors } };
  }

  const quote = quoteCart({ items: req.items, state: address.state });
  if (quote.removedVariantIds.length > 0 || quote.hasIssues) {
    return {
      ok: false,
      status: 409,
      error: { title: "Alguns itens mudaram de disponibilidade. Revise o carrinho antes de finalizar." },
    };
  }

  const shippingCents = computeShippingCents(demoShippingRule, address.state, quote.subtotalCents) ?? 0;
  const createdAt = now.toISOString();
  demoStore.orderSeq += 1;
  const order: DemoOrder = {
    customerId,
    number: `P-${demoStore.orderSeq}`,
    createdAt,
    status: "awaiting_payment",
    lines: quote.lines.map((l) => ({
      productName: l.productName,
      variantLabel: l.variantLabel,
      sku: findVariant(l.variantId)?.variant.sku ?? l.variantId,
      image: l.image,
      unitPriceCents: l.unitPriceCents,
      quantity: l.quantity,
      lineTotalCents: l.lineTotalCents,
    })),
    itemCount: quote.lines.reduce((sum, l) => sum + l.quantity, 0),
    subtotalCents: quote.subtotalCents,
    shippingCents,
    totalCents: quote.subtotalCents + shippingCents,
    address,
    reservedUntil: new Date(now.getTime() + RESERVATION_MINUTES * 60_000).toISOString(),
    history: [{ status: "awaiting_payment", at: createdAt }],
    trackingCode: null,
  };

  demoStore.orders.set(order.number, order);
  demoStore.idempotency.set(scopedKey, order.number);
  return { ok: true, order: toPublic(order) };
}

/** Só devolve o pedido ao próprio cliente; para qualquer outro, é como se não existisse. */
export function getOrderFor(customerId: string, number: string): OrderDetail | null {
  const order = demoStore.orders.get(number);
  return order && order.customerId === customerId ? toPublic(order) : null;
}

export function listOrdersFor(customerId: string): OrderSummary[] {
  return [...demoStore.orders.values()]
    .filter((o) => o.customerId === customerId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(({ number, createdAt, status, totalCents, itemCount }) => ({ number, createdAt, status, totalCents, itemCount }));
}
