"use client";

import type { CartQuote, UF } from "@/lib/api/contract";
import { isUF } from "@/lib/api/contract";
import { formatBRL } from "@/lib/format";
import { UF_OPTIONS } from "@/lib/uf-names";
import { Button, ButtonLink } from "@/components/ui/button";
import { SelectField } from "@/components/ui/field";

interface Props {
  quote: CartQuote;
  state: UF | null;
  onStateChange: (state: UF | null) => void;
  updating: boolean;
}

export function CartSummary({ quote, state, onStateChange, updating }: Props) {
  const remaining = quote.freeShippingRemainingCents;
  const progress = remaining && remaining > 0 ? quote.subtotalCents / (quote.subtotalCents + remaining) : 1;

  let shippingText = "Escolha o estado";
  if (quote.shippingCents === 0) shippingText = "Grátis";
  else if (quote.shippingCents !== null) shippingText = formatBRL(quote.shippingCents);

  return (
    <section aria-labelledby="resumo" className="rounded-[4px] bg-surface p-6 lg:p-8" aria-busy={updating}>
      <h2 id="resumo" className="text-[17px] font-medium">
        Resumo
      </h2>

      <dl className="mt-6 space-y-4 text-[15px]">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-soft">Subtotal</dt>
          <dd className="tabular-nums">{formatBRL(quote.subtotalCents)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-soft">Frete</dt>
          <dd className="tabular-nums">{shippingText}</dd>
        </div>
      </dl>

      <SelectField
        label="Estado de entrega"
        className="mt-5"
        value={state ?? ""}
        onChange={(e) => onStateChange(isUF(e.target.value) ? e.target.value : null)}
      >
        <option value="">Escolha o estado</option>
        {UF_OPTIONS.map(([uf, name]) => (
          <option key={uf} value={uf}>
            {name}
          </option>
        ))}
      </SelectField>

      {remaining !== null && remaining > 0 && (
        <div className="mt-5">
          <p className="text-[15px] text-ink-soft">Faltam {formatBRL(remaining)} para o frete grátis.</p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-mist" aria-hidden="true">
            <div className="h-full bg-rose-deep transition-[width] duration-500" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
        </div>
      )}

      <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-line pt-5">
        <span className="text-[17px]">Total</span>
        <span className="text-xl tabular-nums">{formatBRL(quote.totalCents)}</span>
      </div>
      {quote.shippingCents === null && <p className="mt-1 text-sm text-muted">Sem o frete. Escolha o estado para calcular.</p>}

      <div className="mt-6">
        {quote.hasIssues ? (
          <>
            <Button size="lg" className="w-full" disabled>
              Finalizar compra
            </Button>
            <p className="mt-3 text-[15px] text-danger">Ajuste os itens marcados para continuar.</p>
          </>
        ) : (
          <ButtonLink href="/finalizar" size="lg" className="w-full" aria-disabled={updating || undefined}>
            Finalizar compra
          </ButtonLink>
        )}
      </div>
    </section>
  );
}
