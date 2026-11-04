import type { CartQuote } from "@/lib/api/contract";
import { formatBRL } from "@/lib/format";
import { ProductImage } from "@/components/product/product-image";

export function OrderSummary({ quote }: { quote: CartQuote | null }) {
  return (
    <section aria-labelledby="resumo-pedido" className="rounded-[4px] bg-surface p-6 lg:p-8">
      <h2 id="resumo-pedido" className="text-[17px] font-medium">
        Seu pedido
      </h2>
      {!quote ? (
        <div className="mt-6 h-40 animate-pulse rounded bg-mist" aria-hidden="true" />
      ) : (
        <>
          <ul className="mt-6 space-y-4">
            {quote.lines.map((l) => (
              <li key={l.variantId} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 text-[15px]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-mist">
                  {l.image && <ProductImage image={l.image} sizes="56px" />}
                </div>
                <div className="min-w-0">
                  <p className="truncate">{l.productName}</p>
                  <p className="text-muted">
                    {[l.variantLabel, `${l.quantity} ${l.quantity === 1 ? "unidade" : "unidades"}`].filter(Boolean).join(", ")}
                  </p>
                </div>
                <span className="tabular-nums">{formatBRL(l.lineTotalCents)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-3 border-t border-line pt-5 text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd className="tabular-nums">{formatBRL(quote.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Frete</dt>
              <dd className="tabular-nums">
                {quote.shippingCents === null ? "Calculado na entrega" : quote.shippingCents === 0 ? "Grátis" : formatBRL(quote.shippingCents)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
              <dt className="text-[17px]">Total</dt>
              <dd className="text-xl tabular-nums">{formatBRL(quote.totalCents)}</dd>
            </div>
          </dl>
        </>
      )}
    </section>
  );
}
