import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Criar conta", robots: { index: false } };

export default function RegisterPage() {
  return (
    <AuthShell
      title="Criar conta"
      intro={
        <>
          Já tem conta?{" "}
          <Link href="/entrar" className="text-ink underline underline-offset-4">
            Entrar
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
