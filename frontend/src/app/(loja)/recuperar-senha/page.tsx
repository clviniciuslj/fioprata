import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotForm } from "@/components/auth/forgot-form";

export const metadata: Metadata = { title: "Recuperar senha", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Recuperar senha" intro="Informe o e-mail da sua conta. Vamos enviar um link para você criar uma nova senha.">
      <ForgotForm />
    </AuthShell>
  );
}
