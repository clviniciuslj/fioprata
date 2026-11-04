import Link from "next/link";
import { brand } from "@/config/brand";
import { listCategories } from "@/lib/api/server";
import { UserIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";
import { LogoCompact } from "@/components/brand/logo";
import { CartLink } from "./cart-link";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";

export async function SiteHeader() {
  const categories = await listCategories();
  const items = [
    ...categories.map((c) => ({ href: `/categorias/${c.slug}`, label: c.name })),
    { href: "/produtos", label: "Ver tudo" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
      <Container className="flex h-16 items-center gap-6 lg:h-20">
        <MobileMenu items={items} />
        <Link href="/" aria-label={`${brand.name}, página inicial`} className="text-ink">
          <LogoCompact />
        </Link>
        <nav aria-label="Categorias" className="ml-6 hidden lg:block">
          <NavLinks items={items} className="flex gap-7 text-[15px]" />
        </nav>
        <div className="ml-auto flex items-center gap-1 sm:gap-3">
          <Link
            href="/minha-conta"
            className="inline-flex h-11 items-center gap-2 px-2 text-[15px] text-ink-soft hover:text-ink"
          >
            <UserIcon />
            <span className="hidden sm:inline">Minha conta</span>
          </Link>
          <CartLink />
        </div>
      </Container>
    </header>
  );
}
