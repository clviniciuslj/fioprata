"use client";

import { useState } from "react";
import type { ProductImage as ProductImageData } from "@/lib/api/contract";
import { cx } from "@/lib/cx";
import { ProductImage } from "./product-image";

export function ProductGallery({ images, productName }: { images: ProductImageData[]; productName: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-mist">
        {current && <ProductImage image={current} priority sizes="(min-width: 1024px) 55vw, 100vw" />}
      </div>
      {images.length > 1 && (
        <ul className="grid grid-cols-5 gap-3" aria-label={`Imagens de ${productName}`}>
          {images.map((image, i) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ver imagem ${i + 1} de ${images.length}`}
                aria-pressed={i === active}
                className={cx(
                  "relative block aspect-[4/5] w-full overflow-hidden rounded-[4px] bg-mist ring-offset-2 ring-offset-paper transition",
                  i === active ? "ring-1 ring-rose-deep" : "opacity-70 hover:opacity-100",
                )}
              >
                <ProductImage image={image} sizes="12vw" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
