import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";

export function AuthShell({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <Container className="py-12 lg:py-20">
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-5xl">{title}</h1>
        {intro && <div className="mt-4 text-[17px] text-ink-soft">{intro}</div>}
        <div className="mt-10">{children}</div>
      </div>
    </Container>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-[10px] border border-danger/30 bg-danger/5 px-4 py-3 text-[15px] text-danger">
      {message}
    </p>
  );
}

/** Lê um parâmetro da URL atual no momento do uso, sem depender de renderização dinâmica. */
export function currentSearchParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}
