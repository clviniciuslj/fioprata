"use client";

import { useEffect, useState } from "react";
import type { CartQuote } from "@/lib/api/contract";
import { browserApi, type Result } from "@/lib/api/browser";
import { useCart } from "@/lib/cart/use-cart";
import { useShippingState } from "@/lib/cart/use-shipping-state";
import { Button, ButtonLink } from "@/components/ui/button";
import { CartLine } from "./cart-line";
import { CartSummary } from "./cart-summary";

export function CartView() {
  const { items, ready, setQty, remove, replace } = useCart();
  const [state, setState] = useShippingState();
  const [quote, setQuote] = useState<{ key: string; result: Result<CartQuote> } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const requestKey = JSON.stringify([items, state, attempt]);

  useEffect(() => {
    if (!ready || items.length === 0) return;
    let cancelled = false;
    browserApi.quoteCart({ items, state: state ?? undefined }).then((result) => {
      if (!cancelled) setQuote({ key: requestKey, result });
    });
    return () => {
      cancelled = true;
    };
  }, [ready, items, state, requestKey]);

  // Variações que deixaram de existir saem do carrinho do navegador.
  useEffect(() => {
    const removed = quote?.result.ok ? quote.result.data.removedVariantIds : [];
    if (removed.some((id) => items.some((i) => i.variantId === id))) {
      replace(items.filter((i) => !removed.includes(i.variantId)));
    }
  }, [quote, items, replace]);

  if (!ready) return <CartSkeleton />;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-5 py-10">
        <p className="text-lg text-ink-soft">Seu carrinho está vazio.</p>
        <ButtonLink href="/produtos" variant="secondary">
          Ver as peças
        </ButtonLink>
      </div>
    );
  }

  if (!quote) return <CartSkeleton />;

  if (!quote.result.ok) {
    return (
      <div className="flex flex-col items-start gap-4 py-10" role="alert">
        <p className="text-lg text-ink-soft">Não foi possível atualizar os valores do carrinho. {quote.result.error.title}</p>
        <Button variant="secondary" onClick={() => setAttempt((n) => n + 1)}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  const data = quote.result.data;
  const updating = quote.key !== requestKey;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <ul className="divide-y divide-line border-y border-line lg:col-span-7" aria-label="Itens do carrinho">
        {data.lines.map((line) => (
          <CartLine
            key={line.variantId}
            line={line}
            onQuantity={(qty) => setQty(line.variantId, qty, line.available)}
            onRemove={() => remove(line.variantId)}
          />
        ))}
      </ul>
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <CartSummary quote={data} state={state} onStateChange={setState} updating={updating} />
        </div>
      </div>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14" aria-hidden="true">
      <div className="space-y-6 border-y border-line py-6 lg:col-span-7">
        {[0, 1].map((i) => (
          <div key={i} className="grid grid-cols-[7.5rem_1fr] gap-6">
            <div className="aspect-[4/5] animate-pulse rounded-[4px] bg-mist" />
            <div className="space-y-3">
              <div className="h-4 w-1/2 rounded bg-mist" />
              <div className="h-4 w-1/4 rounded bg-mist" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-[4px] bg-surface lg:col-span-5" />
    </div>
  );
}
