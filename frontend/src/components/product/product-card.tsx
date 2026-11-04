import Link from "next/link";
import type { ProductSummary } from "@/lib/api/contract";
import { Price } from "@/components/ui/price";
import { ProductImage } from "./product-image";

const CARD_SIZES = "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw";

export function ProductCard({ product, priority }: { product: ProductSummary; priority?: boolean }) {
  const [primary, secondary] = product.images;

  return (
    <Link href={`/produtos/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-mist">
        {primary && <ProductImage image={primary} sizes={CARD_SIZES} priority={priority} />}
        {secondary && (
          <ProductImage
            image={secondary}
            sizes={CARD_SIZES}
            className="opacity-0 transition-opacity duration-500 [@media(hover:hover)]:group-hover:opacity-100"
          />
        )}
        {(product.soldOut || product.isNew) && (
          <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-0.5 text-[12px] text-ink-soft">
            {product.soldOut ? "Esgotado" : "Novo"}
          </span>
        )}
      </div>
      <h3 className="mt-3 text-[15px] leading-snug text-ink group-hover:underline group-hover:underline-offset-4">
        {product.name}
      </h3>
      <Price
        cents={product.fromPriceCents}
        fromPrice={product.hasPriceRange}
        className={product.soldOut ? "mt-1 block text-[15px] text-muted" : "mt-1 block text-[15px] text-ink-soft"}
      />
    </Link>
  );
}
