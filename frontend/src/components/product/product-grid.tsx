import type { ProductSummary } from "@/lib/api/contract";
import { ProductCard } from "./product-card";

export function ProductGrid({ products, priorityCount = 0 }: { products: ProductSummary[]; priorityCount?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard product={product} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
