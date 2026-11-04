import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { listOrders } from "@/lib/api/server";
import { formatBRL, formatDate } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { requireCustomer } from "@/components/account/require-customer";

export const metadata: Metadata = { title: "Meus pedidos" };

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-[4px] bg-mist" aria-hidden="true" />}>
      <OrdersList />
    </Suspense>
  );
}

async function OrdersList() {
  await requireCustomer("/minha-conta/pedidos");
  const orders = await listOrders();

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-lg text-ink-soft">Você ainda não fez pedidos.</p>
        <ButtonLink href="/produtos" variant="secondary">
          Ver as peças
        </ButtonLink>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line border-y border-line" aria-label="Pedidos">
      {orders.map((o) => (
        <li key={o.number}>
          <Link
            href={`/minha-conta/pedidos/${o.number}`}
            className="group grid grid-cols-2 items-center gap-x-4 gap-y-2 py-5 sm:grid-cols-[1fr_1fr_auto_8rem]"
          >
            <span className="text-[17px] group-hover:underline group-hover:underline-offset-4">{o.number}</span>
            <span className="text-right text-[15px] text-muted sm:text-left">{formatDate(o.createdAt)}</span>
            <span>
              <OrderStatusBadge status={o.status} />
            </span>
            <span className="text-right text-[15px] tabular-nums">{formatBRL(o.totalCents)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
