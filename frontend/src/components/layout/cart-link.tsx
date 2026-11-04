"use client";

import Link from "next/link";
import { BagIcon } from "@/components/ui/icons";
import { useCart } from "@/lib/cart/use-cart";

export function CartLink() {
  const { count, ready } = useCart();
  const visibleCount = ready ? count : 0;

  return (
    <Link
      href="/carrinho"
      className="relative inline-flex h-11 items-center gap-2 px-2 text-[15px] text-ink-soft hover:text-ink"
      aria-label={visibleCount > 0 ? `Carrinho, ${visibleCount} ${visibleCount === 1 ? "item" : "itens"}` : "Carrinho"}
    >
      <BagIcon />
      <span className="hidden sm:inline">Carrinho</span>
      {visibleCount > 0 && (
        <span className="absolute right-0 top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-deep px-1 text-[11px] leading-5 text-paper sm:static">
          {visibleCount}
        </span>
      )}
    </Link>
  );
}
