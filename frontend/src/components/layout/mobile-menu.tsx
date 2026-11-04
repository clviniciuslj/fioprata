"use client";

import Link from "next/link";
import { useRef } from "react";
import { brand } from "@/config/brand";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { LogoCompact } from "@/components/brand/logo";
import { NavLinks, type NavItem } from "./nav-links";

/** Gaveta do celular. O <dialog> nativo prende o foco e fecha com Esc. */
export function MobileMenu({ items }: { items: NavItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="-ml-2 inline-flex size-11 items-center justify-center lg:hidden"
        aria-label="Abrir menu"
      >
        <MenuIcon />
      </button>
      <dialog
        ref={dialog}
        aria-label="Menu"
        onClick={(e) => e.target === dialog.current && close()}
        className="m-0 h-dvh max-h-none w-[min(22rem,88vw)] max-w-none bg-paper p-0 text-ink backdrop:bg-ink/30 open:flex open:flex-col"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <Link href="/" onClick={close} aria-label={`${brand.name}, página inicial`} className="text-ink">
            <LogoCompact />
          </Link>
          <button type="button" onClick={close} className="inline-flex size-11 items-center justify-center" aria-label="Fechar menu">
            <CloseIcon />
          </button>
        </div>
        <nav aria-label="Categorias" className="px-4 py-6">
          <NavLinks items={items} onNavigate={close} className="flex flex-col gap-5 text-lg" />
        </nav>
        <div className="mt-auto border-t border-line px-4 py-6">
          <NavLinks
            items={[
              { href: "/minha-conta", label: "Minha conta" },
              { href: "/contato", label: "Contato" },
            ]}
            onNavigate={close}
            className="flex flex-col gap-4"
          />
        </div>
      </dialog>
    </>
  );
}
