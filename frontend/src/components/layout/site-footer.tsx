import Link from "next/link";
import { cacheLife } from "next/cache";
import { brand } from "@/config/brand";
import { listCategories } from "@/lib/api/server";
import { Container } from "@/components/ui/container";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function SiteFooter() {
  const [categories, year] = await Promise.all([listCategories(), currentYear()]);
  const { contact, legal } = brand;

  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.4fr]">
        <div className="max-w-xs">
          <p className="font-display text-3xl">{brand.name}</p>
          <p className="mt-3 text-[15px] text-muted">{brand.description}</p>
        </div>

        <nav aria-label="Loja">
          <h2 className="text-[15px] font-medium">Loja</h2>
          <ul className="mt-4 space-y-2.5 text-[15px] text-ink-soft">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/categorias/${c.slug}`} className="hover:text-ink hover:underline underline-offset-4">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Ajuda">
          <h2 className="text-[15px] font-medium">Ajuda</h2>
          <ul className="mt-4 space-y-2.5 text-[15px] text-ink-soft">
            <li><Link href="/minha-conta/pedidos" className="hover:text-ink hover:underline underline-offset-4">Meus pedidos</Link></li>
            <li><Link href="/politicas/troca-e-devolucao" className="hover:text-ink hover:underline underline-offset-4">Troca e devolução</Link></li>
            <li><Link href="/politicas/privacidade" className="hover:text-ink hover:underline underline-offset-4">Privacidade</Link></li>
            <li><Link href="/contato" className="hover:text-ink hover:underline underline-offset-4">Contato</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="text-[15px] font-medium">Atendimento</h2>
          <ul className="mt-4 space-y-2.5 text-[15px] text-ink-soft">
            <li>
              <a href={`mailto:${contact.email}`} className="hover:text-ink hover:underline underline-offset-4">
                {contact.email}
              </a>
            </li>
            {contact.whatsapp && (
              <li>
                <a href={`https://wa.me/${contact.whatsapp}`} className="hover:text-ink hover:underline underline-offset-4" rel="noopener noreferrer" target="_blank">
                  WhatsApp {contact.whatsappDisplay}
                </a>
              </li>
            )}
            <li>{contact.hours}</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-1 py-6 text-[13px] text-muted sm:flex-row sm:justify-between">
          <p>
            © {year} {brand.name}. {legal.companyName}, CNPJ {legal.cnpj}.
          </p>
          <p>{legal.address}</p>
        </Container>
      </div>
    </footer>
  );
}
