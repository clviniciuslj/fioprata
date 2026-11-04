"use client";

import Link from "next/link";
import type { CartQuoteLine } from "@/lib/api/contract";
import { MAX_LINE_QTY } from "@/lib/cart/cart";
import { Price } from "@/components/ui/price";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { ProductImage } from "@/components/product/product-image";

interface Props {
  line: CartQuoteLine;
  onQuantity: (qty: number) => void;
  onRemove: () => void;
}

export function CartLine({ line, onQuantity, onRemove }: Props) {
  const max = Math.max(1, Math.min(MAX_LINE_QTY, line.available));
  const unit = line.available === 1 ? "unidade" : "unidades";

  return (
    <li className="grid grid-cols-[6rem_1fr] gap-4 py-6 sm:grid-cols-[7.5rem_1fr] sm:gap-6">
      <Link href={`/produtos/${line.productSlug}`} className="relative block aspect-[4/5] overflow-hidden rounded-[4px] bg-mist">
        {line.image && <ProductImage image={line.image} sizes="120px" />}
      </Link>

      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <div>
            <Link href={`/produtos/${line.productSlug}`} className="text-[17px] hover:underline underline-offset-4">
              {line.productName}
            </Link>
            {line.variantLabel && <p className="text-[15px] text-muted">{line.variantLabel}</p>}
          </div>
          <Price cents={line.lineTotalCents} className="text-[17px]" />
        </div>

        {line.issue === "unavailable" ? (
          <p className="text-[15px] text-danger">Esta peça esgotou. Remova do carrinho para continuar.</p>
        ) : (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <QuantityStepper value={line.quantity} max={max} onChange={onQuantity} label={`Quantidade de ${line.productName}`} />
            <span className="text-[15px] text-muted">
              <Price cents={line.unitPriceCents} /> cada
            </span>
          </div>
        )}

        {line.issue === "insufficient" && (
          <p className="text-[15px] text-danger">
            Temos só {line.available} {unit} desta peça.{" "}
            <button type="button" onClick={() => onQuantity(line.available)} className="text-ink underline underline-offset-4">
              Ajustar para {line.available}
            </button>
          </p>
        )}

        <button type="button" onClick={onRemove} className="self-start text-[15px] text-ink-soft underline underline-offset-4 hover:text-ink">
          Remover
        </button>
      </div>
    </li>
  );
}
