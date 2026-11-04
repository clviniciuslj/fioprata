import Link from "next/link";
import type { CatalogQuery } from "@/lib/api/contract";
import { CATALOG_SORTS } from "@/lib/catalog-params";
import { cx } from "@/lib/cx";
import { catalogHref } from "./catalog-href";

export function CatalogToolbar({ basePath, query, totalItems }: { basePath: string; query: CatalogQuery; totalItems: number }) {
  return (
    <div className="flex flex-col gap-3 border-y border-line py-3 text-[15px] sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted">
        {totalItems} {totalItems === 1 ? "peça" : "peças"}
      </p>
      <nav aria-label="Ordenar por" className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="text-muted">Ordenar por</span>
        {CATALOG_SORTS.map((s) => {
          const current = s.value === query.sort;
          return (
            <Link
              key={s.value}
              href={catalogHref(basePath, { sort: s.value, page: 1 })}
              aria-current={current ? "true" : undefined}
              scroll={false}
              className={cx("underline-offset-[6px] hover:underline", current ? "text-ink underline" : "text-ink-soft")}
            >
              {s.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
