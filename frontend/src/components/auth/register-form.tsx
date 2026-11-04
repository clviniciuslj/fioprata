"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { RegisterResponse } from "@/lib/api/contract";
import { browserApi } from "@/lib/api/browser";
import { safeReturnPath } from "@/lib/safe-return";
import { PASSWORD_MIN, validateEmail, validateName, validatePassword } from "@/lib/validation";
import { Button, ButtonLink } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { FormError, currentSearchParam } from "./auth-shell";

type Errors = Partial<Record<"name" | "email" | "password", string>>;

interface Props {
  /** Chamado após o cadastro; sem ele, o formulário mostra a confirmação e o botão para continuar. */
  onRegistered?: (response: RegisterResponse) => void;
  submitLabel?: string;
}

export function RegisterForm({ onRegistered, submitLabel = "Criar conta" }: Props) {
  const router = useRouter();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<RegisterResponse | null>(null);

  const update = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    const local: Errors = {};
    const nameError = validateName(values.name);
    const emailError = validateEmail(values.email);
    const passwordError = validatePassword(values.password);
    if (nameError) local.name = nameError;
    if (emailError) local.email = emailError;
    if (passwordError) local.password = passwordError;
    setErrors(local);
    setFormError(null);
    if (Object.keys(local).length > 0) return;

    setSubmitting(true);
    const result = await browserApi.register(values);
    setSubmitting(false);
    if (!result.ok) {
      const server = result.error.errors ?? {};
      setErrors({ name: server.name?.[0], email: server.email?.[0], password: server.password?.[0] });
      setFormError(result.error.title);
      return;
    }
    router.refresh();
    if (onRegistered) onRegistered(result.data);
    else setDone(result.data);
  }

  if (done) {
    return (
      <div className="flex flex-col gap-5" role="status">
        <p className="text-[17px] text-ink-soft">
          Conta criada. Enviamos um link de confirmação para <strong className="font-medium text-ink">{done.customer.email}</strong>.
        </p>
        {done.demoConfirmationPath && (
          <p className="rounded-[10px] bg-mist px-4 py-3 text-[15px] text-ink-soft">
            Demonstração: o e-mail não é enviado.{" "}
            <Link href={done.demoConfirmationPath} className="text-ink underline underline-offset-4">
              Abrir o link de confirmação
            </Link>
          </p>
        )}
        <ButtonLink href={safeReturnPath(currentSearchParam("voltar"))} size="lg" className="w-full">
          Continuar
        </ButtonLink>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <FormError message={formError} />
      <TextField label="Nome" name="name" autoComplete="name" required value={values.name} onChange={update("name")} error={errors.name} />
      <TextField label="E-mail" type="email" name="email" autoComplete="email" required value={values.email} onChange={update("email")} error={errors.email} />
      <TextField
        label="Senha"
        type="password"
        name="password"
        autoComplete="new-password"
        required
        value={values.password}
        onChange={update("password")}
        error={errors.password}
        hint={`Pelo menos ${PASSWORD_MIN} caracteres. Uma frase curta é fácil de lembrar e difícil de adivinhar.`}
      />
      <p className="text-sm text-muted">
        Ao criar a conta, você concorda com a{" "}
        <Link href="/politicas/privacidade" className="underline underline-offset-4">
          Política de Privacidade
        </Link>
        .
      </p>
      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? "Criando conta…" : submitLabel}
      </Button>
    </form>
  );
}
