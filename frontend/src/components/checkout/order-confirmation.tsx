import type { CreateOrderResponse } from "@/lib/api/contract";
import { formatBRL, formatTime } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button";

export function OrderConfirmation({ order, demo }: { order: CreateOrderResponse; demo: boolean }) {
  return (
    <div className="mx-auto max-w-xl py-6 text-center" role="status">
      <h1 className="font-display text-5xl lg:text-6xl">Pedido recebido</h1>
      <p className="mt-6 text-lg text-ink-soft">
        Número do pedido <strong className="font-medium text-ink">{order.number}</strong>
      </p>
      <dl className="mx-auto mt-8 max-w-sm divide-y divide-line border-y border-line text-left text-[15px]">
        <div className="flex justify-between gap-4 py-3">
          <dt className="text-muted">Situação</dt>
          <dd>Aguardando pagamento</dd>
        </div>
        <div className="flex justify-between gap-4 py-3">
          <dt className="text-muted">Total</dt>
          <dd className="tabular-nums">{formatBRL(order.totalCents)}</dd>
        </div>
      </dl>
      {order.reservedUntil && (
        <p className="mt-6 text-[17px] text-ink-soft">Reservamos suas peças até {formatTime(order.reservedUntil)}.</p>
      )}
      {demo && (
        <p className="mx-auto mt-6 max-w-md rounded-[10px] bg-mist px-4 py-3 text-[15px] text-ink-soft">
          Demonstração: nenhum pagamento é solicitado. O pedido continua aguardando pagamento até a forma de pagamento ser definida.
        </p>
      )}
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <ButtonLink href={`/minha-conta/pedidos/${order.number}`}>Acompanhar pedido</ButtonLink>
        <ButtonLink href="/produtos" variant="secondary">
          Continuar comprando
        </ButtonLink>
      </div>
    </div>
  );
}
