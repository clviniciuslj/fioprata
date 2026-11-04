"use client";

import { isUF, type UF } from "@/lib/api/contract";
import { createStoredValue } from "@/lib/local-store";

const store = createStoredValue<UF | null>(
  "store.shipping-state.v1",
  (raw) => {
    try {
      const value: unknown = raw ? JSON.parse(raw) : null;
      return isUF(value) ? value : null;
    } catch {
      return null;
    }
  },
  null,
);

/** Estado de entrega escolhido no carrinho, reaproveitado na finalização. */
export function useShippingState(): [UF | null, (state: UF | null) => void] {
  return [store.useValue(), store.write];
}
