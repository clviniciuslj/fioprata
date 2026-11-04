import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { LogoutButton } from "@/components/account/logout-button";
import { NavLinks } from "@/components/layout/nav-links";

export const metadata: Metadata = { robots: { index: false } };

export default function AccountLayout({ children }: LayoutProps<"/minha-conta">) {
  return (
    <Container className="py-10 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <h1 className="font-display text-5xl lg:text-6xl">Minha conta</h1>
        <div className="flex items-center gap-6">
          <nav aria-label="Minha conta">
            <NavLinks
              items={[
                { href: "/minha-conta", label: "Resumo" },
                { href: "/minha-conta/pedidos", label: "Pedidos", matchNested: true },
              ]}
              className="flex gap-6 text-[15px]"
            />
          </nav>
          <LogoutButton />
        </div>
      </div>
      <div className="mt-10">{children}</div>
    </Container>
  );
}
