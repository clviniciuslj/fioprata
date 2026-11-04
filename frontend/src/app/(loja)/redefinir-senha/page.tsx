import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetForm } from "@/components/auth/reset-form";

export const metadata: Metadata = { title: "Nova senha", robots: { index: false } };

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Nova senha">
      <ResetForm />
    </AuthShell>
  );
}
