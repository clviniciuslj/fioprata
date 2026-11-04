import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/config/brand";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a nossa equipe por e-mail, WhatsApp ou Instagram.",
};

export default function ContactPage() {
  const { contact, legal } = brand;
  const whatsapp: string = contact.whatsapp;
  const instagram: string = contact.instagram;
  const channels: { label: string; value: string; href: string }[] = [
    { label: "E-mail", value: contact.email, href: `mailto:${contact.email}` },
  ];
  if (whatsapp) channels.push({ label: "WhatsApp", value: contact.whatsappDisplay || whatsapp, href: `https://wa.me/${whatsapp}` });
  if (instagram) channels.push({ label: "Instagram", value: `@${instagram}`, href: `https://instagram.com/${instagram}` });

  return (
    <Container className="py-10 lg:py-14">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h1 className="font-display text-5xl lg:text-6xl">Contato</h1>
          <p className="mt-6 max-w-md text-[17px] text-ink-soft">
            Dúvidas sobre numeração, cuidados com a prata ou um pedido? Fale com a gente pelo canal que preferir.
          </p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <dl className="divide-y divide-line border-y border-line">
            {channels.map((c) => (
              <div key={c.label} className="grid grid-cols-[7rem_1fr] gap-4 py-5 text-[17px]">
                <dt className="text-muted">{c.label}</dt>
                <dd>
                  <a
                    href={c.href}
                    className="underline underline-offset-4 hover:text-ink-soft"
                    {...(c.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    {c.value}
                  </a>
                </dd>
              </div>
            ))}
            <div className="grid grid-cols-[7rem_1fr] gap-4 py-5 text-[17px]">
              <dt className="text-muted">Horário</dt>
              <dd>{contact.hours}</dd>
            </div>
          </dl>

          <h2 className="mt-12 text-[17px] font-medium">Antes de escrever</h2>
          <ul className="mt-4 space-y-3 text-[15px] text-ink-soft">
            <li>
              A situação de cada pedido aparece em{" "}
              <Link href="/minha-conta/pedidos" className="text-ink underline underline-offset-4">
                Meus pedidos
              </Link>
              .
            </li>
            <li>
              Prazos e condições de troca estão na{" "}
              <Link href="/politicas/troca-e-devolucao" className="text-ink underline underline-offset-4">
                política de troca e devolução
              </Link>
              .
            </li>
          </ul>

          <p className="mt-12 text-sm text-muted">
            {legal.companyName}, CNPJ {legal.cnpj}. {legal.address}.
          </p>
        </div>
      </div>
    </Container>
  );
}
