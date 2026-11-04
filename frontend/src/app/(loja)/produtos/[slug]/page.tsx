import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, getProduct, getShippingRule, listProductSlugs, listRelated } from "@/lib/api/server";
import { formatBRL } from "@/lib/format";
import { Container } from "@/components/ui/container";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductSpecs } from "@/components/product/product-specs";
import { PurchasePanel } from "@/components/product/purchase-panel";

export async function generateStaticParams() {
  const slugs = await listProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/produtos/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return {};
  const photos = product.images.filter((i) => !i.src.endsWith(".svg"));
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: photos.map((i) => ({ url: i.src, alt: i.alt })),
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/produtos/[slug]">) {
  // Lido fora do <Suspense> para que um produto inexistente responda 404.
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [category, related, shipping] = await Promise.all([
    getCategory(product.categorySlug),
    listRelated(product.slug, 4),
    getShippingRule(),
  ]);

  return (
    <>
      <Container className="py-6 lg:py-10">
        <nav aria-label="Você está em" className="text-sm text-muted">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/" className="hover:text-ink hover:underline underline-offset-4">Início</Link>
              <span aria-hidden="true" className="ml-2">/</span>
            </li>
            {category && (
              <li>
                <Link href={`/categorias/${category.slug}`} className="hover:text-ink hover:underline underline-offset-4">
                  {category.name}
                </Link>
                <span aria-hidden="true" className="ml-2">/</span>
              </li>
            )}
            <li aria-current="page" className="text-ink-soft">{product.name}</li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <PurchasePanel product={product} />

              <div className="mt-10 space-y-8">
                <p className="max-w-[60ch] text-[17px] leading-relaxed text-ink-soft">{product.description}</p>
                <ProductSpecs specs={product.specs} />
                <div className="divide-y divide-line border-b border-line">
                  <details className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-medium">
                      Cuidados com a peça
                      <span aria-hidden="true" className="text-xl leading-none transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{product.care}</p>
                  </details>
                  <details className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-medium">
                      Entrega e troca
                      <span aria-hidden="true" className="text-xl leading-none transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                      O frete é calculado no carrinho, pelo estado de entrega
                      {shipping.freeAboveCents !== null && `, e é grátis acima de ${formatBRL(shipping.freeAboveCents)}`}.
                      Você pode desistir da compra em até 7 dias depois de receber.{" "}
                      <Link href="/politicas/troca-e-devolucao" className="underline underline-offset-4">
                        Ver a política de troca
                      </Link>
                    </p>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <section aria-labelledby="veja-tambem" className="mt-12 border-t border-line pt-14">
          <Container>
            <h2 id="veja-tambem" className="font-display text-4xl">Veja também</h2>
            <div className="mt-8">
              <ProductGrid products={related} />
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
