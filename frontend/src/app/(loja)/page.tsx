import Image from "next/image";
import Link from "next/link";
import { getShippingRule, listCategories, listNewArrivals } from "@/lib/api/server";
import { formatBRL } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductImage } from "@/components/product/product-image";

const HERO_IMAGE = { src: "/demo-art/anel-solitario-zirconia.webp", alt: "Ilustração provisória: anel solitário em prata" };

export default async function HomePage() {
  const [categories, newArrivals, shipping] = await Promise.all([
    listCategories(),
    listNewArrivals(8),
    getShippingRule(),
  ]);

  return (
    <>
      <section className="border-b border-line">
        <Container className="grid items-center gap-8 py-8 lg:grid-cols-12 lg:gap-10 lg:py-14">
          <div className="sheen-once relative order-first aspect-[5/4] overflow-hidden rounded-[4px] bg-mist lg:order-last lg:col-span-7 lg:aspect-[6/5]">
            <Image
              src={HERO_IMAGE.src}
              alt={HERO_IMAGE.alt}
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover object-[50%_40%]"
            />
          </div>
          <div className="lg:col-span-5">
            <h1 className="font-display text-[44px] leading-[1.05] sm:text-6xl lg:text-[76px]">
              Prata 925 para usar todos os dias.
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink-soft">
              Anéis, colares, brincos e pulseiras em prata de lei, com envio para todo o Brasil e troca em até 7 dias.
            </p>
            <ButtonLink href="/produtos" size="lg" className="mt-8">
              Ver as peças
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section aria-labelledby="categorias" className="pt-14 pb-6 lg:pt-20 lg:pb-8">
        <Container>
          <h2 id="categorias" className="font-display text-4xl lg:text-5xl">
            Escolha pelo tipo de peça
          </h2>
          <ul className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5 lg:gap-6">
            {categories.map((c) => (
              <li key={c.slug} className="w-[42vw] shrink-0 snap-start sm:w-auto">
                <Link href={`/categorias/${c.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-mist">
                    {c.image && <ProductImage image={c.image} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 42vw" />}
                  </div>
                  <p className="mt-3 text-[17px] group-hover:underline group-hover:underline-offset-4">{c.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="novidades" className="py-12 lg:py-16">
        <Container>
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="novidades" className="font-display text-4xl lg:text-5xl">
              Novidades
            </h2>
            <Link href="/produtos" className="text-[15px] text-ink-soft underline underline-offset-4 hover:text-ink">
              Ver todas as peças
            </Link>
          </div>
          <div className="mt-10">
            <ProductGrid products={newArrivals} />
          </div>
        </Container>
      </section>

      <section aria-labelledby="prata-925" className="mt-8 bg-surface py-16 lg:py-24">
        <Container className="grid gap-10 lg:grid-cols-12">
          <h2 id="prata-925" className="font-display text-4xl leading-tight lg:col-span-5 lg:text-5xl">
            O que é prata 925
          </h2>
          <div className="max-w-[62ch] space-y-5 text-[17px] leading-relaxed text-ink-soft lg:col-span-6 lg:col-start-7">
            <p>
              Prata 925, ou prata de lei, é uma liga com 92,5% de prata pura e 7,5% de outros metais, geralmente
              cobre. A mistura dá firmeza à peça sem tirar o brilho da prata.
            </p>
            <p>
              Com o tempo, o contato com a pele, o perfume e a umidade podem escurecer a superfície. É uma reação
              natural e reversível: uma flanela própria para prata devolve o brilho.
            </p>
            <h3 className="pt-4 text-[17px] font-medium text-ink">Como cuidar</h3>
            <ul className="divide-y divide-line border-y border-line">
              <li className="py-3">Guarde cada peça separada, em local seco.</li>
              <li className="py-3">Tire antes de entrar no mar, na piscina ou no banho.</li>
              <li className="py-3">Limpe com flanela própria, sem produtos abrasivos.</li>
            </ul>
          </div>
        </Container>
      </section>

      <section aria-label="Como funciona a compra" className="py-16 lg:py-20">
        <Container className="grid gap-10 text-[15px] sm:grid-cols-3">
          <div>
            <h3 className="text-[17px] font-medium">Troca e devolução</h3>
            <p className="mt-2 text-ink-soft">
              Você tem 7 dias depois de receber o pedido para desistir da compra.{" "}
              <Link href="/politicas/troca-e-devolucao" className="underline underline-offset-4 hover:text-ink">
                Ver a política
              </Link>
            </p>
          </div>
          <div>
            <h3 className="text-[17px] font-medium">Frete</h3>
            <p className="mt-2 text-ink-soft">
              {shipping.freeAboveCents !== null
                ? `Grátis acima de ${formatBRL(shipping.freeAboveCents)}. Abaixo disso, o valor aparece no carrinho antes de você fechar o pedido.`
                : "O valor aparece no carrinho antes de você fechar o pedido."}
            </p>
          </div>
          <div>
            <h3 className="text-[17px] font-medium">Atendimento</h3>
            <p className="mt-2 text-ink-soft">
              Dúvidas sobre numeração ou cuidados?{" "}
              <Link href="/contato" className="underline underline-offset-4 hover:text-ink">
                Fale com a gente
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
