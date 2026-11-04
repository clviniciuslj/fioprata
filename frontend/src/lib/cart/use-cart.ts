"use client";

import { useSyncExternalStore } from "react";
import { CART_STORAGE_KEY, addItem, parseStoredCart, removeItem, setQuantity, type CartItem } from "./cart";

const EMPTY: CartItem[] = [];
const listeners = new Set<() => void>();

// Cópia em memória: continua funcionando na sessão mesmo se o navegador bloquear o armazenamento.
let cache: { raw: string | null; items: CartItem[] } = { raw: null, items: EMPTY };

function readStorage(): CartItem[] {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(CART_STORAGE_KEY);
  } catch {
    return cache.items;
  }
  if (raw !== cache.raw) cache = { raw, items: parseStoredCart(raw) };
  return cache.items;
}

function write(items: CartItem[]) {
  const raw = JSON.stringify(items);
  cache = { raw, items };
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, raw);
  } catch {
    // Armazenamento indisponível (janela privada, cota): mantém só em memória.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === CART_STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const subscribeNothing = () => () => {};

export function useCart() {
  const items = useSyncExternalStore(subscribe, readStorage, () => EMPTY);
  // Falso no servidor e durante a hidratação; evita mostrar "carrinho vazio" antes de ler o navegador.
  const ready = useSyncExternalStore(subscribeNothing, () => true, () => false);

  return {
    items,
    ready,
    count: items.reduce((sum, i) => sum + i.quantity, 0),
    add: (variantId: string, qty: number, maxAvailable: number) => write(addItem(readStorage(), variantId, qty, maxAvailable)),
    setQty: (variantId: string, qty: number, maxAvailable?: number) =>
      write(setQuantity(readStorage(), variantId, qty, maxAvailable)),
    remove: (variantId: string) => write(removeItem(readStorage(), variantId)),
    replace: (next: CartItem[]) => write(next),
    clear: () => write(EMPTY),
  };
}
