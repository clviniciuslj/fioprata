"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { browserApi } from "@/lib/api/browser";
import { validateEmail } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { FormError } from "./auth-shell";

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState<{ demoResetPath?: string } | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    const emailError = validateEmail(email);
    setError(emailError);
    if (emailError) return;
    setSubmitting(true);
    const result = await browserApi.forgotPassword(email);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error.title);
      return;
    }
    setSent(result.data);
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-5" role="status">
        <p className="text-[17px] text-ink-soft">
          Se houver uma conta com este e-mail, você vai receber um link para criar uma nova senha. Confira também a caixa de spam.
        </p>
        {sent.demoResetPath && (
          <p className="rounded-[10px] bg-mist px-4 py-3 text-[15px] text-ink-soft">
            Demonstração: o e-mail não é enviado.{" "}
            <Link href={sent.demoResetPath} className="text-ink underline underline-offset-4">
              Abrir o link de nova senha
            </Link>
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <FormError message={error} />
      <TextField label="E-mail da conta" type="email" name="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? "Enviando…" : "Enviar link"}
      </Button>
      <Link href="/entrar" className="text-[15px] text-ink-soft underline underline-offset-4 hover:text-ink">
        Voltar para entrar
      </Link>
    </form>
  );
}
