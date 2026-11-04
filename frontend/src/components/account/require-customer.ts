import "server-only";
import { redirect } from "next/navigation";
import type { Customer } from "@/lib/api/contract";
import { getCurrentCustomer } from "@/lib/api/server";

/** Proteção real da área do cliente: sem sessão válida, vai para o login e volta para cá depois. */
export async function requireCustomer(returnTo: string): Promise<Customer> {
  const customer = await getCurrentCustomer();
  if (!customer) redirect(`/entrar?voltar=${encodeURIComponent(returnTo)}`);
  return customer;
}
