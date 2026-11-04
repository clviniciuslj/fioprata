import type { CatalogQuery, CatalogSort } from "@/lib/api/contract";

export const CATALOG_PAGE_SIZE = 12;

export const CATALOG_SORTS: { value: CatalogSort; label: string }[] = [
  { value: "novidades", label: "Novidades" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
];

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Lê ordenação e página da URL; qualquer valor inválido vira o padrão. */
export function parseCatalogParams(sp: SearchParams): CatalogQuery {
  const rawSort = first(sp.sort);
  const sort = CATALOG_SORTS.some((s) => s.value === rawSort) ? (rawSort as CatalogSort) : "novidades";

  const rawPage = first(sp.page);
  const page = rawPage && /^\d+$/.test(rawPage) && Number(rawPage) >= 1 ? Number(rawPage) : 1;

  return { sort, page };
}
