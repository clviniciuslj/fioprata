"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Customer } from "@/lib/api/contract";
import { browserApi } from "@/lib/api/browser";
import { safeReturnPath } from "@/lib/safe-return";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { FormError, currentSearchParam } from "./auth-shell";

interface Props {
  demo: boolean;
  /** Na finalização, o login acontece no lugar, sem trocar de página. */
  onLoggedIn?: (customer: Customer) => void;
}

export function LoginForm({ demo, onLoggedIn }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState(demo ? "cliente@example.com" : "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const result = await browserApi.login({ email, password });
    if (!result.ok) {
      setError(result.error.title);
      setSubmitting(false);
      return;
    }
    if (onLoggedIn) {
      router.refresh();
      onLoggedIn(result.data);
      return;
    }
    router.replace(safeReturnPath(currentSearchParam("voltar")));
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <FormError message={error} />
      <TextField label="E-mail" type="email" name="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField
        label="Senha"
        type="password"
        name="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        hint={demo ? "Na demonstração, qualquer senha funciona para contas existentes." : undefined}
      />
      <Button type="submit" size="lg" disabled={submitting} className="mt-2 w-full">
        {submitting ? "Entrando…" : "Entrar"}
      </Button>
      <div className="flex flex-wrap justify-between gap-3 text-[15px]">
        <Link href="/recuperar-senha" className="text-ink-soft underline underline-offset-4 hover:text-ink">
          Esqueci minha senha
        </Link>
        <Link
          href="/cadastro"
          onClick={(e) => {
            const voltar = currentSearchParam("voltar");
            if (voltar) {
              e.preventDefault();
              router.push(`/cadastro?voltar=${encodeURIComponent(safeReturnPath(voltar))}`);
            }
          }}
          className="text-ink-soft underline underline-offset-4 hover:text-ink"
        >
          Criar conta
        </Link>
      </div>
    </form>
  );
}
