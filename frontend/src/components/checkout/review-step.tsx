"use client";

import Link from "next/link";
import type { Address, CartQuote } from "@/lib/api/contract";
import { formatPostalCode } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/auth/auth-shell";

interface Props {
  address: Address;
  quote: CartQuote | null;
  submitting: boolean;
  error: string | null;
  onConfirm: () => void;
}

export function ReviewStep({ address, quote, submitting, error, onConfirm }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-[15px] leading-relaxed text-ink-soft">
        <p className="text-ink">{address.recipient}</p>
        <p>
          {address.street}, {address.number}
          {address.complement ? `, ${address.complement}` : ""}
        </p>
        <p>
          {address.district}, {address.city} - {address.state}, CEP {formatPostalCode(address.postalCode)}
        </p>
      </div>

      <p className="rounded-[10px] bg-mist px-4 py-3 text-[15px] text-ink-soft">
        Ao confirmar, reservamos as peças por um tempo limitado e o pedido fica aguardando pagamento.
      </p>

      <FormError message={error} />

      {quote?.hasIssues ? (
        <p className="text-[15px] text-danger">
          Alguns itens mudaram de disponibilidade.{" "}
          <Link href="/carrinho" className="text-ink underline underline-offset-4">
            Revise o carrinho
          </Link>{" "}
          para continuar.
        </p>
      ) : (
        <Button size="lg" onClick={onConfirm} disabled={submitting || !quote} className="self-start">
          {submitting ? "Confirmando…" : "Confirmar pedido"}
        </Button>
      )}
    </div>
  );
}
