import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCategory, listCategories } from "@/lib/api/server";
import { Container } from "@/components/ui/container";
import { CatalogSkeleton, CatalogView } from "@/components/catalog/catalog-view";

export async function generateStaticParams() {
  const categories = await listCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/categorias/[slug]">): Promise<Metadata> {
  const category = await getCategory((await params).slug);
  return category ? { title: category.name, description: category.description } : {};
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/categorias/[slug]">) {
  // Lido fora do <Suspense> para que uma categoria inexistente responda 404 antes de qualquer HTML.
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  return (
    <Container className="py-10 lg:py-14">
      <h1 className="font-display text-5xl lg:text-6xl">{category.name}</h1>
      <p className="mt-3 max-w-xl text-[17px] text-ink-soft">{category.description}</p>
      <div className="mt-8">
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogView basePath={`/categorias/${category.slug}`} category={category.slug} searchParams={searchParams} />
        </Suspense>
      </div>
    </Container>
  );
}
