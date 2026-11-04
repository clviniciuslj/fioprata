import type { ApiError, Customer, RegisterRequest } from "@/lib/api/contract";
import { validateEmail, validateName, validatePassword } from "@/lib/validation";
import { demoStore } from "./store";

/**
 * Contas de demonstração. Não há backend: a senha é validada quanto ao formato,
 * mas não é guardada nem conferida no login. Na etapa do backend, o ASP.NET Core Identity assume.
 */

const normalizeEmail = (email: string) => email.trim().toLowerCase();

function findByEmail(email: string): Customer | undefined {
  const normalized = normalizeEmail(email);
  for (const c of demoStore.customers.values()) {
    if (c.email === normalized) return c;
  }
  return undefined;
}

export function registerCustomer(
  req: RegisterRequest,
): { ok: true; customer: Customer; confirmToken: string } | { ok: false; error: ApiError } {
  const errors: Record<string, string[]> = {};
  const nameError = validateName(req.name ?? "");
  const emailError = validateEmail(req.email ?? "");
  const passwordError = validatePassword(req.password ?? "");
  if (nameError) errors.name = [nameError];
  if (emailError) errors.email = [emailError];
  if (passwordError) errors.password = [passwordError];
  if (!emailError && findByEmail(req.email)) {
    errors.email = ["Já existe uma conta com este e-mail. Entre ou recupere a senha."];
  }
  if (Object.keys(errors).length > 0) return { ok: false, error: { title: "Revise os dados do cadastro.", errors } };

  const customer: Customer = {
    id: `c-${crypto.randomUUID()}`,
    name: req.name.trim(),
    email: normalizeEmail(req.email),
    emailConfirmed: false,
  };
  demoStore.customers.set(customer.id, customer);
  const confirmToken = crypto.randomUUID();
  demoStore.emailTokens.set(confirmToken, customer.id);
  return { ok: true, customer, confirmToken };
}

export function authenticate(email: string, password: string): Customer | null {
  void password; // Sem backend não há senha guardada para conferir.
  return findByEmail(email) ?? null;
}

export function createSession(customerId: string): string {
  const token = crypto.randomUUID();
  demoStore.sessions.set(token, customerId);
  return token;
}

export function customerFromSession(token: string | undefined): Customer | null {
  if (!token) return null;
  const customerId = demoStore.sessions.get(token);
  return customerId ? (demoStore.customers.get(customerId) ?? null) : null;
}

export function destroySession(token: string | undefined): void {
  if (token) demoStore.sessions.delete(token);
}

export function confirmEmail(token: string): boolean {
  const customerId = demoStore.emailTokens.get(token);
  const customer = customerId ? demoStore.customers.get(customerId) : undefined;
  if (!customer) return false;
  demoStore.emailTokens.delete(token);
  demoStore.customers.set(customer.id, { ...customer, emailConfirmed: true });
  return true;
}

/** Devolve o token só para uso da demonstração; a resposta ao navegador é sempre a mesma. */
export function requestPasswordReset(email: string): string | null {
  const customer = findByEmail(email);
  if (!customer) return null;
  const token = crypto.randomUUID();
  demoStore.resetTokens.set(token, customer.id);
  return token;
}

export function resetPassword(token: string, password: string): { ok: true } | { ok: false; error: ApiError } {
  const passwordError = validatePassword(password ?? "");
  if (passwordError) return { ok: false, error: { title: "Senha inválida.", errors: { password: [passwordError] } } };
  const customerId = demoStore.resetTokens.get(token);
  if (!customerId) return { ok: false, error: { title: "Este link não é mais válido. Peça um novo." } };
  demoStore.resetTokens.delete(token);
  // Trocar a senha encerra as sessões abertas em outros dispositivos.
  for (const [session, owner] of demoStore.sessions) {
    if (owner === customerId) demoStore.sessions.delete(session);
  }
  return { ok: true };
}
