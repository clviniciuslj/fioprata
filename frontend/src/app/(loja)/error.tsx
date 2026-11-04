"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function StoreError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-20 lg:py-28">
      <h1 className="font-display text-5xl lg:text-6xl">Não foi possível carregar esta página</h1>
      <p className="mt-6 max-w-md text-[17px] text-ink-soft">
        Pode ter sido uma falha momentânea da conexão ou do nosso servidor. Seu carrinho continua salvo.
      </p>
      <Button onClick={retry} className="mt-8">
        Tentar novamente
      </Button>
    </Container>
  );
}
