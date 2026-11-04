import type {
  CatalogQuery,
  Category,
  Page,
  ProductDetail,
  ProductImage,
  ProductSummary,
  ProductVariant,
} from "@/lib/api/contract";
import { CATALOG_PAGE_SIZE } from "@/lib/catalog-params";
import { DEMO_CARE_TEXT, demoCategories, demoProducts, type DemoProduct } from "./catalog-data";

function imagesFor(p: DemoProduct): ProductImage[] {
  return [
    { src: `/demo-art/${p.slug}.webp`, alt: `Ilustração provisória: ${p.name}` },
    { src: `/demo-art/${p.slug}-detalhe.webp`, alt: `Ilustração provisória: ${p.name}, detalhe` },
  ];
}

function toSummary(p: DemoProduct): ProductSummary {
  const prices = p.variants.map((v) => v.priceCents);
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    categorySlug: p.categorySlug,
    fromPriceCents: Math.min(...prices),
    hasPriceRange: new Set(prices).size > 1,
    images: imagesFor(p),
    isNew: p.isNew,
    soldOut: p.variants.every((v) => v.available <= 0),
  };
}

function toDetail(p: DemoProduct): ProductDetail {
  return {
    ...toSummary(p),
    description: p.description,
    care: DEMO_CARE_TEXT,
    specs: p.specs,
    variantLabel: p.variantLabel,
    variants: p.variants,
  };
}

const byNewest = (a: DemoProduct, b: DemoProduct) => b.publishedAt.localeCompare(a.publishedAt);

export function listCategories(): Category[] {
  return demoCategories;
}

export function getCategory(slug: string): Category | null {
  return demoCategories.find((c) => c.slug === slug) ?? null;
}

export function listProducts(query: CatalogQuery): Page<ProductSummary> {
  const filtered = demoProducts
    .filter((p) => !query.category || p.categorySlug === query.category)
    .map((p) => ({ product: p, summary: toSummary(p) }));

  filtered.sort((a, b) => {
    switch (query.sort) {
      case "menor-preco":
        return a.summary.fromPriceCents - b.summary.fromPriceCents || a.summary.name.localeCompare(b.summary.name);
      case "maior-preco":
        return b.summary.fromPriceCents - a.summary.fromPriceCents || a.summary.name.localeCompare(b.summary.name);
      default:
        return byNewest(a.product, b.product);
    }
  });

  const totalItems = filtered.length;
  const start = (query.page - 1) * CATALOG_PAGE_SIZE;
  return {
    items: filtered.slice(start, start + CATALOG_PAGE_SIZE).map((f) => f.summary),
    page: query.page,
    pageSize: CATALOG_PAGE_SIZE,
    totalItems,
    totalPages: Math.ceil(totalItems / CATALOG_PAGE_SIZE),
  };
}

export function listNewArrivals(limit: number): ProductSummary[] {
  return [...demoProducts].sort(byNewest).slice(0, limit).map(toSummary);
}

export function getProduct(slug: string): ProductDetail | null {
  const product = demoProducts.find((p) => p.slug === slug);
  return product ? toDetail(product) : null;
}

export function listRelated(slug: string, limit: number): ProductSummary[] {
  const product = demoProducts.find((p) => p.slug === slug);
  if (!product) return [];
  const others = demoProducts.filter((p) => p.id !== product.id).sort(byNewest);
  const sameCategory = others.filter((p) => p.categorySlug === product.categorySlug);
  const rest = others.filter((p) => p.categorySlug !== product.categorySlug);
  return [...sameCategory, ...rest].slice(0, limit).map(toSummary);
}

export function listProductSlugs(): string[] {
  return demoProducts.map((p) => p.slug);
}

export function findVariant(variantId: string): { product: ProductDetail; variant: ProductVariant } | null {
  for (const p of demoProducts) {
    const variant = p.variants.find((v) => v.id === variantId);
    if (variant) return { product: toDetail(p), variant };
  }
  return null;
}
