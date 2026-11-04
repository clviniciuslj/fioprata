"use client";

import { createStoredValue, useHydrated } from "@/lib/local-store";
import { CART_STORAGE_KEY, addItem, parseStoredCart, removeItem, setQuantity, type CartItem } from "./cart";

const EMPTY: CartItem[] = [];
const cartStore = createStoredValue<CartItem[]>(CART_STORAGE_KEY, parseStoredCart, EMPTY);

const { read, write } = cartStore;

// Ações definidas uma vez: referências estáveis para usar em dependências de efeitos.
const actions = {
  add: (variantId: string, qty: number, maxAvailable: number) => write(addItem(read(), variantId, qty, maxAvailable)),
  setQty: (variantId: string, qty: number, maxAvailable?: number) => write(setQuantity(read(), variantId, qty, maxAvailable)),
  remove: (variantId: string) => write(removeItem(read(), variantId)),
  replace: (next: CartItem[]) => write(next),
  clear: () => write(EMPTY),
};

export function useCart() {
  const items = cartStore.useValue();
  // Evita mostrar "carrinho vazio" antes de ler o navegador.
  const ready = useHydrated();

  return {
    items,
    ready,
    count: items.reduce((sum, i) => sum + i.quantity, 0),
    ...actions,
  };
}
