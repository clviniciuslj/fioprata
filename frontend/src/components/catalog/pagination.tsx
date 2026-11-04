import Link from "next/link";
import type { CatalogQuery } from "@/lib/api/contract";
import { cx } from "@/lib/cx";
import { catalogHref } from "./catalog-href";

export function Pagination({ basePath, query, totalPages }: { basePath: string; query: CatalogQuery; totalPages: number }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const href = (page: number) => catalogHref(basePath, { sort: query.sort, page });

  return (
    <nav aria-label="Páginas" className="mt-14 flex items-center justify-center gap-2 text-[15px]">
      {query.page > 1 && (
        <Link href={href(query.page - 1)} className="px-3 py-2 text-ink-soft hover:text-ink hover:underline underline-offset-4">
          Anterior
        </Link>
      )}
      {pages.map((page) => (
        <Link
          key={page}
          href={href(page)}
          aria-current={page === query.page ? "page" : undefined}
          aria-label={`Página ${page}`}
          className={cx(
            "inline-flex size-10 items-center justify-center rounded-full",
            page === query.page ? "bg-ink text-paper" : "text-ink-soft hover:bg-mist",
          )}
        >
          {page}
        </Link>
      ))}
      {query.page < totalPages && (
        <Link href={href(query.page + 1)} className="px-3 py-2 text-ink-soft hover:text-ink hover:underline underline-offset-4">
          Próxima
        </Link>
      )}
    </nav>
  );
}
