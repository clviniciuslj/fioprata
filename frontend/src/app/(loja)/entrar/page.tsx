import type { Metadata } from "next";
import { dataSource } from "@/lib/api/data-source";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Entrar", robots: { index: false } };

export default function LoginPage() {
  return (
    <AuthShell title="Entrar" intro="Acesse seus pedidos e finalize compras mais rápido.">
      <LoginForm demo={dataSource() === "demo"} />
    </AuthShell>
  );
}
