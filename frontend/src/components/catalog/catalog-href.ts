import type { CatalogQuery } from "@/lib/api/contract";

/** Monta a URL do catálogo omitindo os valores padrão. */
export function catalogHref(basePath: string, query: Pick<CatalogQuery, "sort" | "page">): string {
  const params = new URLSearchParams();
  if (query.sort !== "novidades") params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
