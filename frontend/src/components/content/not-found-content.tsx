import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function NotFoundContent() {
  return (
    <Container className="py-20 lg:py-28">
      <h1 className="font-display text-5xl lg:text-6xl">Página não encontrada</h1>
      <p className="mt-6 max-w-md text-[17px] text-ink-soft">
        O endereço pode ter mudado ou a peça saiu do catálogo.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/produtos">Ver as peças</ButtonLink>
        <ButtonLink href="/" variant="secondary">
          Ir para o início
        </ButtonLink>
      </div>
    </Container>
  );
}
