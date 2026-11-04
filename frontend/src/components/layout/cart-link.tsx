"use client";

import Link from "next/link";
import { BagIcon } from "@/components/ui/icons";

export function CartLink() {
  // Contagem provisória: passa a vir do carrinho real na Task 5.
  const count: number = 0;
  return (
    <Link
      href="/carrinho"
      className="relative inline-flex h-11 items-center gap-2 px-2 text-[15px] text-ink-soft hover:text-ink"
      aria-label={count > 0 ? `Carrinho, ${count} ${count === 1 ? "item" : "itens"}` : "Carrinho"}
    >
      <BagIcon />
      <span className="hidden sm:inline">Carrinho</span>
      {count > 0 && (
        <span className="absolute right-0 top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] leading-5 text-paper sm:static">
          {count}
        </span>
      )}
    </Link>
  );
}
