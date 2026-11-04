import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ConfirmEmail } from "@/components/auth/confirm-email";

export const metadata: Metadata = { title: "Confirmar e-mail", robots: { index: false } };

export default function ConfirmEmailPage() {
  return (
    <AuthShell title="Confirmar e-mail">
      <ConfirmEmail />
    </AuthShell>
  );
}
