"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { cx } from "@/lib/cx";

export interface NavItem {
  href: string;
  label: string;
  /** Também destaca as páginas abaixo deste endereço (ex.: detalhe de um pedido). */
  matchNested?: boolean;
}

interface Props {
  items: NavItem[];
  className?: string;
  onNavigate?: () => void;
}

/**
 * Lista de links que destaca a página atual. O endereço é dado de requisição em rotas dinâmicas,
 * então a lista sem destaque entra no HTML estático e o destaque aparece quando o endereço é conhecido.
 */
export function NavLinks(props: Props) {
  return (
    <Suspense fallback={<LinkList {...props} current={null} />}>
      <ActiveLinkList {...props} />
    </Suspense>
  );
}

function ActiveLinkList(props: Props) {
  return <LinkList {...props} current={usePathname()} />;
}

function LinkList({ items, className, onNavigate, current }: Props & { current: string | null }) {
  return (
    <ul className={className}>
      {items.map((item) => {
        const active = current === item.href || (item.matchNested === true && current?.startsWith(`${item.href}/`) === true);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={cx(
                "underline-offset-[6px] decoration-1 transition-colors hover:text-ink hover:underline",
                active ? "text-ink underline" : "text-ink-soft",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
