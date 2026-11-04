"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProductDetail } from "@/lib/api/contract";
import { MAX_LINE_QTY } from "@/lib/cart/cart";
import { useCart } from "@/lib/cart/use-cart";
import { cx } from "@/lib/cx";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { QuantityStepper } from "@/components/ui/quantity-stepper";

export function PurchasePanel({ product }: { product: ProductDetail }) {
  const { items, add, ready } = useCart();
  const singleVariant = product.variants.length === 1 ? product.variants[0] : null;
  const [variantId, setVariantId] = useState<string | null>(singleVariant?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const [addedVariantId, setAddedVariantId] = useState<string | null>(null);

  const variant = product.variants.find((v) => v.id === variantId) ?? null;
  const inCart = ready && variant ? (items.find((i) => i.variantId === variant.id)?.quantity ?? 0) : 0;
  const remaining = variant ? Math.max(0, Math.min(MAX_LINE_QTY, variant.available) - inCart) : 0;
  const qty = Math.min(quantity, Math.max(remaining, 1));

  function chooseVariant(id: string) {
    setVariantId(id);
    setQuantity(1);
    setAddedVariantId(null);
  }

  function handleAdd() {
    if (!variant || remaining <= 0) return;
    add(variant.id, qty, variant.available);
    setQuantity(1);
    setAddedVariantId(variant.id);
  }

  let buttonLabel = "Adicionar ao carrinho";
  if (product.soldOut) buttonLabel = "Esgotado";
  else if (!variant) buttonLabel = `Escolha ${product.variantLabel?.toLowerCase() === "comprimento" ? "o comprimento" : "a numeração"}`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-4xl leading-tight lg:text-5xl">{product.name}</h1>
        <Price
          cents={variant ? variant.priceCents : product.fromPriceCents}
          fromPrice={!variant && product.hasPriceRange}
          className="mt-3 block text-xl text-ink-soft"
        />
      </div>

      {!singleVariant && (
        <fieldset>
          <legend className="text-[15px] text-ink-soft">{product.variantLabel ?? "Opções"}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const soldOut = v.available <= 0;
              const selected = v.id === variantId;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => chooseVariant(v.id)}
                  disabled={soldOut}
                  aria-pressed={selected}
                  aria-label={soldOut ? `${v.label}, esgotado` : (v.label ?? undefined)}
                  className={cx(
                    "h-11 min-w-16 rounded-full border px-4 text-[15px] transition-colors",
                    selected ? "border-rose-deep bg-rose-deep text-paper" : "border-line bg-surface text-ink hover:border-rose-deep",
                    soldOut && "cursor-not-allowed border-line bg-transparent text-muted line-through hover:border-line",
                  )}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {variant && !product.soldOut && (
        <div className="flex flex-wrap items-center gap-4">
          <QuantityStepper value={qty} max={Math.max(remaining, 1)} onChange={setQuantity} />
          {variant.available === 1 && <p className="text-[15px] text-ink-soft">Última unidade</p>}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Button
          size="lg"
          onClick={handleAdd}
          disabled={!variant || product.soldOut || remaining <= 0}
          className="w-full"
        >
          {buttonLabel}
        </Button>
        {variant && remaining <= 0 && !product.soldOut && inCart > 0 && (
          <p className="text-[15px] text-ink-soft">
            Todas as unidades disponíveis já estão no seu{" "}
            <Link href="/carrinho" className="underline underline-offset-4">
              carrinho
            </Link>
            .
          </p>
        )}
        <p role="status" className="min-h-6 text-[15px] text-success">
          {addedVariantId && addedVariantId === variant?.id && (
            <>
              Adicionado ao carrinho.{" "}
              <Link href="/carrinho" className="text-ink underline underline-offset-4">
                Ver carrinho
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
