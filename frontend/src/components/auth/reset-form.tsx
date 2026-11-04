"use client";

import { useState, type FormEvent } from "react";
import { browserApi } from "@/lib/api/browser";
import { PASSWORD_MIN, validatePassword } from "@/lib/validation";
import { Button, ButtonLink } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { FormError, currentSearchParam } from "./auth-shell";

export function ResetForm() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirmation?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    const local: typeof errors = {};
    const passwordError = validatePassword(password);
    if (passwordError) local.password = passwordError;
    if (!passwordError && confirmation !== password) local.confirmation = "As senhas não são iguais.";
    setErrors(local);
    setFormError(null);
    if (Object.keys(local).length > 0) return;

    const token = currentSearchParam("token");
    if (!token) {
      setFormError("Este link está incompleto. Peça um novo link de recuperação.");
      return;
    }
    setSubmitting(true);
    const result = await browserApi.resetPassword(token, password);
    setSubmitting(false);
    if (!result.ok) {
      setFormError(result.error.title);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-col gap-5" role="status">
        <p className="text-[17px] text-ink-soft">Senha alterada. Por segurança, as sessões abertas em outros aparelhos foram encerradas.</p>
        <ButtonLink href="/entrar" size="lg" className="w-full">
          Entrar
        </ButtonLink>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <FormError message={formError} />
      <TextField
        label="Nova senha"
        type="password"
        name="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        hint={`Pelo menos ${PASSWORD_MIN} caracteres.`}
      />
      <TextField
        label="Repita a nova senha"
        type="password"
        name="confirmation"
        autoComplete="new-password"
        value={confirmation}
        onChange={(e) => setConfirmation(e.target.value)}
        error={errors.confirmation}
      />
      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? "Salvando…" : "Salvar nova senha"}
      </Button>
    </form>
  );
}
