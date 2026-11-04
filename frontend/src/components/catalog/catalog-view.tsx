import type { CatalogQuery } from "@/lib/api/contract";
import { listProducts } from "@/lib/api/server";
import { parseCatalogParams } from "@/lib/catalog-params";
import { ButtonLink } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";
import { CatalogToolbar } from "./catalog-toolbar";
import { Pagination } from "./pagination";

type SearchParams = Record<string, string | string[] | undefined>;

interface Props {
  basePath: string;
  category?: string;
  searchParams: Promise<SearchParams>;
}

/** Lê ordenação e página da URL (dado de requisição) e por isso fica dentro de um <Suspense>. */
export async function CatalogView({ basePath, category, searchParams }: Props) {
  const query: CatalogQuery = { ...parseCatalogParams(await searchParams), category };
  const page = await listProducts(query);

  return (
    <>
      <CatalogToolbar basePath={basePath} query={query} totalItems={page.totalItems} />
      <div className="mt-8">
        {page.items.length > 0 ? (
          <ProductGrid products={page.items} priorityCount={4} />
        ) : (
          <div className="flex flex-col items-start gap-5 py-16">
            <p className="max-w-md text-lg text-ink-soft">
              {page.totalItems > 0 ? "Esta página não existe. As peças continuam na primeira página." : "Nenhuma peça disponível aqui por enquanto."}
            </p>
            <ButtonLink href={page.totalItems > 0 ? basePath : "/produtos"} variant="secondary">
              {page.totalItems > 0 ? "Voltar à primeira página" : "Ver todas as peças"}
            </ButtonLink>
          </div>
        )}
      </div>
      <Pagination basePath={basePath} query={query} totalPages={page.totalPages} />
    </>
  );
}

export function CatalogSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="h-12 border-y border-line" />
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {Array.from({ length: 8 }, (_, i) => (
          <li key={i}>
            <div className="aspect-[4/5] animate-pulse rounded-[4px] bg-mist" />
            <div className="mt-3 h-4 w-2/3 rounded bg-mist" />
            <div className="mt-2 h-4 w-1/3 rounded bg-mist" />
          </li>
        ))}
      </ul>
    </div>
  );
}
