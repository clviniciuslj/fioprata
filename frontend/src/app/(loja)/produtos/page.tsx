import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { CatalogSkeleton, CatalogView } from "@/components/catalog/catalog-view";

export const metadata: Metadata = {
  title: "Todas as peças",
  description: "Anéis, colares, brincos, pulseiras e pingentes em prata 925.",
};

export default function ProductsPage({ searchParams }: PageProps<"/produtos">) {
  return (
    <Container className="py-10 lg:py-14">
      <h1 className="font-display text-5xl lg:text-6xl">Todas as peças</h1>
      <div className="mt-8">
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogView basePath="/produtos" searchParams={searchParams} />
        </Suspense>
      </div>
    </Container>
  );
}
