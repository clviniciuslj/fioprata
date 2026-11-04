"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Address, CartQuote, CreateOrderResponse, Customer } from "@/lib/api/contract";
import { browserApi } from "@/lib/api/browser";
import { useCart } from "@/lib/cart/use-cart";
import { useShippingState } from "@/lib/cart/use-shipping-state";
import { cx } from "@/lib/cx";
import { AddressStep, emptyAddress } from "./address-step";
import { IdentifyStep } from "./identify-step";
import { OrderConfirmation } from "./order-confirmation";
import { OrderSummary } from "./order-summary";
import { ReviewStep } from "./review-step";

export function CheckoutFlow({ demo }: { demo: boolean }) {
  const router = useRouter();
  const { items, ready, clear } = useCart();
  const [shippingState, setShippingState] = useShippingState();
  // undefined: ainda verificando a sessão; null: sem sessão.
  const [customer, setCustomer] = useState<Customer | null | undefined>(undefined);
  const [address, setAddress] = useState<Address | null>(null);
  const [editingAddress, setEditingAddress] = useState(true);
  const [quote, setQuote] = useState<CartQuote | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<CreateOrderResponse | null>(null);
  // Uma chave por tentativa de compra: repetir o envio após falha de rede não duplica o pedido.
  const idempotencyKey = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    browserApi.me().then((r) => {
      if (!cancelled) setCustomer(r.ok ? r.data : null);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || items.length === 0) return;
    let cancelled = false;
    browserApi.quoteCart({ items, state: shippingState ?? undefined }).then((r) => {
      if (!cancelled && r.ok) setQuote(r.data);
    });
    return () => {
      cancelled = true;
    };
  }, [ready, items, shippingState]);

  useEffect(() => {
    if (confirmation) clear();
    else if (ready && items.length === 0) router.replace("/carrinho");
  }, [confirmation, ready, items.length, clear, router]);

  if (confirmation) return <OrderConfirmation order={confirmation} demo={demo} />;

  const step = customer === null ? 1 : editingAddress || !address ? 2 : 3;

  async function confirm() {
    if (!address || submitting) return;
    setSubmitting(true);
    setError(null);
    idempotencyKey.current ??= crypto.randomUUID();
    const result = await browserApi.createOrder({ items, address }, idempotencyKey.current);
    setSubmitting(false);
    if (result.ok) {
      setConfirmation(result.data);
      return;
    }
    // Recusa definitiva: a próxima tentativa é um pedido novo. Falha de rede (status 0) mantém a chave.
    if (result.status >= 400) idempotencyKey.current = null;
    if (result.status === 401) setCustomer(null);
    setError(result.error.title);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <ol className="flex flex-col gap-4 lg:col-span-7">
        <Step number={1} title="Identificação" state={step === 1 ? "current" : "done"}>
          {customer === undefined ? (
            <div className="h-24 animate-pulse rounded bg-mist" aria-hidden="true" />
          ) : customer === null ? (
            <IdentifyStep
              demo={demo}
              onIdentified={(c) => {
                setCustomer(c);
                setError(null);
              }}
            />
          ) : (
            <p className="text-[15px] text-ink-soft">
              {customer.name}, {customer.email}
            </p>
          )}
        </Step>

        <Step
          number={2}
          title="Entrega"
          state={step === 2 ? "current" : step > 2 ? "done" : "upcoming"}
          onEdit={step === 3 ? () => setEditingAddress(true) : undefined}
        >
          {step === 2 && customer && (
            <AddressStep
              initial={address ?? emptyAddress(customer.name, shippingState ?? "")}
              onSubmit={(a) => {
                setAddress(a);
                setShippingState(a.state);
                setEditingAddress(false);
              }}
            />
          )}
          {step === 3 && address && (
            <p className="text-[15px] text-ink-soft">
              {address.street}, {address.number}, {address.city} - {address.state}
            </p>
          )}
        </Step>

        <Step number={3} title="Revisão" state={step === 3 ? "current" : "upcoming"}>
          {step === 3 && address && (
            <ReviewStep address={address} quote={quote} submitting={submitting} error={error} onConfirm={confirm} />
          )}
        </Step>
      </ol>

      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <OrderSummary quote={quote} />
        </div>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  state,
  onEdit,
  children,
}: {
  number: number;
  title: string;
  state: "done" | "current" | "upcoming";
  onEdit?: () => void;
  children: ReactNode;
}) {
  return (
    <li
      aria-current={state === "current" ? "step" : undefined}
      className={cx("rounded-[4px] border p-5 sm:p-6", state === "current" ? "border-rose-deep bg-surface" : "border-line")}
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className={cx("flex items-center gap-3 text-[17px]", state === "upcoming" ? "text-muted" : "text-ink")}>
          <span
            className={cx(
              "inline-flex size-7 items-center justify-center rounded-full border text-[13px]",
              state === "upcoming" ? "border-line" : "border-rose-deep",
              state === "done" && "bg-rose-deep text-paper",
            )}
            aria-hidden="true"
          >
            {number}
          </span>
          {title}
        </h2>
        {onEdit && (
          <button type="button" onClick={onEdit} className="text-[15px] text-ink-soft underline underline-offset-4 hover:text-ink">
            Alterar
          </button>
        )}
      </div>
      {state !== "upcoming" && <div className="mt-5">{children}</div>}
    </li>
  );
}
