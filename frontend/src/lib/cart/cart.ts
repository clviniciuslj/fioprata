import type { CartItemInput } from "@/lib/api/contract";

/**
 * O carrinho do navegador guarda apenas variação e quantidade.
 * Preço, disponibilidade e frete são sempre recalculados pelo servidor.
 */
export type CartItem = CartItemInput;

export const MAX_LINE_QTY = 10;
export const MAX_LINES = 50;
export const CART_STORAGE_KEY = "store.cart.v1";

const clamp = (qty: number, maxAvailable = MAX_LINE_QTY) => Math.max(0, Math.min(qty, MAX_LINE_QTY, maxAvailable));

export function addItem(items: CartItem[], variantId: string, qty: number, maxAvailable: number): CartItem[] {
  const existing = items.find((i) => i.variantId === variantId);
  const quantity = clamp((existing?.quantity ?? 0) + qty, maxAvailable);
  if (quantity <= 0) return items.filter((i) => i.variantId !== variantId);
  if (existing) return items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i));
  return [...items, { variantId, quantity }];
}

export function setQuantity(items: CartItem[], variantId: string, qty: number, maxAvailable?: number): CartItem[] {
  if (!items.some((i) => i.variantId === variantId)) return items;
  const quantity = clamp(qty, maxAvailable);
  if (quantity <= 0) return removeItem(items, variantId);
  return items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i));
}

export function removeItem(items: CartItem[], variantId: string): CartItem[] {
  return items.filter((i) => i.variantId !== variantId);
}

/** Lê o que estiver salvo no navegador sem nunca lançar erro: dado inválido é descartado. */
export function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];

  const merged = new Map<string, number>();
  for (const entry of data) {
    if (!entry || typeof entry !== "object") continue;
    const { variantId, quantity } = entry as Record<string, unknown>;
    if (typeof variantId !== "string" || variantId.length === 0 || variantId.length > 64) continue;
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1) continue;
    merged.set(variantId, (merged.get(variantId) ?? 0) + quantity);
  }

  return [...merged]
    .slice(0, MAX_LINES)
    .map(([variantId, quantity]) => ({ variantId, quantity: clamp(quantity) }));
}
