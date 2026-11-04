import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getOrder } from "@/lib/api/server";
import { formatBRL, formatDate, formatDateTime, formatPostalCode } from "@/lib/format";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { OrderTimeline } from "@/components/account/order-timeline";
import { requireCustomer } from "@/components/account/require-customer";
import { ProductImage } from "@/components/product/product-image";

export const metadata: Metadata = { title: "Acompanhar pedido" };

export default function OrderPage({ params }: PageProps<"/minha-conta/pedidos/[number]">) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-[4px] bg-mist" aria-hidden="true" />}>
      <OrderDetailView params={params} />
    </Suspense>
  );
}

async function OrderDetailView({ params }: Pick<PageProps<"/minha-conta/pedidos/[number]">, "params">) {
  const { number } = await params;
  await requireCustomer(`/minha-conta/pedidos/${number}`);
  const order = await getOrder(number);
  if (!order) notFound();

  const { address } = order;

  return (
    <div>
      <Link href="/minha-conta/pedidos" className="text-[15px] text-ink-soft underline underline-offset-4 hover:text-ink">
        Todos os pedidos
      </Link>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <h2 className="font-display text-4xl">
          Pedido <span className="font-sans text-3xl tabular-nums">{order.number}</span>
        </h2>
        <OrderStatusBadge status={order.status} />
      </div>
      <p className="mt-2 text-[15px] text-muted">Feito em {formatDate(order.createdAt)}</p>

      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        <section aria-labelledby="andamento" className="lg:col-span-5">
          <h3 id="andamento" className="text-[17px] font-medium">
            Andamento
          </h3>
          <div className="mt-6">
            <OrderTimeline order={order} />
          </div>
          {order.status === "awaiting_payment" && order.reservedUntil && (
            <p className="mt-6 rounded-[10px] bg-mist px-4 py-3 text-[15px] text-ink-soft">
              As peças ficam reservadas até {formatDateTime(order.reservedUntil)}. Sem confirmação de pagamento até lá, o pedido expira.
            </p>
          )}
          {order.trackingCode && (
            <p className="mt-6 text-[15px] text-ink-soft">
              Código de rastreio: <span className="font-medium text-ink">{order.trackingCode}</span>
            </p>
          )}
        </section>

        <div className="space-y-10 lg:col-span-6 lg:col-start-7">
          <section aria-labelledby="itens">
            <h3 id="itens" className="text-[17px] font-medium">
              Itens
            </h3>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {order.lines.map((l) => (
                <li key={l.sku} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 py-4 text-[15px]">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-mist">
                    {l.image && <ProductImage image={l.image} sizes="56px" />}
                  </div>
                  <div>
                    <p>{l.productName}</p>
                    <p className="text-muted">
                      {[l.variantLabel, `${l.quantity} × ${formatBRL(l.unitPriceCents)}`].filter(Boolean).join(", ")}
                    </p>
                  </div>
                  <span className="tabular-nums">{formatBRL(l.lineTotalCents)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="tabular-nums">{formatBRL(order.subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Frete</dt>
                <dd className="tabular-nums">{order.shippingCents === 0 ? "Grátis" : formatBRL(order.shippingCents)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-[17px]">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatBRL(order.totalCents)}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="entrega">
            <h3 id="entrega" className="text-[17px] font-medium">
              Entrega
            </h3>
            <address className="mt-4 text-[15px] not-italic leading-relaxed text-ink-soft">
              {address.recipient}
              <br />
              {address.street}, {address.number}
              {address.complement ? `, ${address.complement}` : ""}
              <br />
              {address.district}, {address.city} - {address.state}
              <br />
              CEP {formatPostalCode(address.postalCode)}
            </address>
          </section>
        </div>
      </div>
    </div>
  );
}
