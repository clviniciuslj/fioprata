import { Container } from "@/components/ui/container";

export default function StoreLoading() {
  return (
    <Container className="py-10 lg:py-14">
      <span className="sr-only" role="status">
        Carregando…
      </span>
      <div className="h-14 w-64 animate-pulse rounded bg-mist" aria-hidden="true" />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-[4px] bg-mist" />
        ))}
      </div>
    </Container>
  );
}
