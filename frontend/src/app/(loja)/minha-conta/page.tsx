import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { listOrders } from "@/lib/api/server";
import { formatBRL, formatDate } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { requireCustomer } from "@/components/account/require-customer";

export const metadata: Metadata = { title: "Minha conta" };

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="h-48 animate-pulse rounded-[4px] bg-mist" aria-hidden="true" />}>
      <AccountOverview />
    </Suspense>
  );
}

async function AccountOverview() {
  const customer = await requireCustomer("/minha-conta");
  const orders = await listOrders();
  const latest = orders[0];

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <section aria-labelledby="dados" className="lg:col-span-5">
        <h2 id="dados" className="text-[17px] font-medium">
          Seus dados
        </h2>
        <dl className="mt-4 divide-y divide-line border-y border-line text-[15px]">
          <div className="grid grid-cols-[6rem_1fr] gap-4 py-3">
            <dt className="text-muted">Nome</dt>
            <dd>{customer.name}</dd>
          </div>
          <div className="grid grid-cols-[6rem_1fr] gap-4 py-3">
            <dt className="text-muted">E-mail</dt>
            <dd className="break-all">{customer.email}</dd>
          </div>
        </dl>
        {!customer.emailConfirmed && (
          <p className="mt-4 rounded-[10px] bg-mist px-4 py-3 text-[15px] text-ink-soft">
            Confirme seu e-mail pelo link que enviamos para receber as atualizações dos seus pedidos.
          </p>
        )}
      </section>

      <section aria-labelledby="ultimo-pedido" className="lg:col-span-6 lg:col-start-7">
        <h2 id="ultimo-pedido" className="text-[17px] font-medium">
          Último pedido
        </h2>
        {latest ? (
          <div className="mt-4 rounded-[4px] bg-surface p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[17px]">{latest.number}</p>
              <OrderStatusBadge status={latest.status} />
            </div>
            <p className="mt-2 text-[15px] text-muted">
              {formatDate(latest.createdAt)}, {latest.itemCount} {latest.itemCount === 1 ? "item" : "itens"},{" "}
              {formatBRL(latest.totalCents)}
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-[15px]">
              <Link href={`/minha-conta/pedidos/${latest.number}`} className="underline underline-offset-4">
                Acompanhar pedido
              </Link>
              <Link href="/minha-conta/pedidos" className="text-ink-soft underline underline-offset-4 hover:text-ink">
                Ver todos os pedidos
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-start gap-4">
            <p className="text-[15px] text-ink-soft">Você ainda não fez pedidos.</p>
            <ButtonLink href="/produtos" variant="secondary">
              Ver as peças
            </ButtonLink>
          </div>
        )}
      </section>
    </div>
  );
}
