import Image from "next/image";
import type { ProductImage as ProductImageData } from "@/lib/api/contract";
import { cx } from "@/lib/cx";

interface Props {
  image: ProductImageData;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** Fundo névoa com proporção 4:5. As ilustrações SVG de demonstração dispensam otimização. */
export function ProductImage({ image, sizes, priority, className }: Props) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={image.src.endsWith(".svg")}
      className={cx("object-cover", className)}
    />
  );
}
