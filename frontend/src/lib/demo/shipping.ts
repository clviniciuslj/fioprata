import type { ShippingRule, UF } from "@/lib/api/contract";

/** Regra de frete: grátis a partir do mínimo; senão, valor do estado ou padrão. `null` sem estado. */
export function computeShippingCents(rule: ShippingRule, state: UF | undefined, subtotalCents: number): number | null {
  if (rule.freeAboveCents !== null && subtotalCents >= rule.freeAboveCents) return 0;
  if (!state) return null;
  return rule.byState[state] ?? rule.defaultCents;
}
