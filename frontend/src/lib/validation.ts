import { isUF, type Address } from "@/lib/api/contract";

/**
 * Validações compartilhadas. No navegador servem só para conforto;
 * o servidor repete todas antes de gravar qualquer coisa.
 */

export const PASSWORD_MIN = 10;
export const PASSWORD_MAX = 128;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string | null {
  const v = value.trim();
  if (!v) return "Informe seu e-mail.";
  if (v.length > 254 || !EMAIL_PATTERN.test(v)) return "Informe um e-mail válido, como nome@exemplo.com.";
  return null;
}

export function validatePassword(value: string): string | null {
  if (value.length < PASSWORD_MIN) return `A senha precisa ter pelo menos ${PASSWORD_MIN} caracteres.`;
  if (value.length > PASSWORD_MAX) return `A senha pode ter no máximo ${PASSWORD_MAX} caracteres.`;
  return null;
}

export function validateName(value: string): string | null {
  const v = value.trim();
  if (v.length < 2) return "Informe seu nome.";
  if (v.length > 100) return "Use no máximo 100 caracteres.";
  return null;
}

function required(value: string | undefined, message: string, max: number): string | null {
  const v = (value ?? "").trim();
  if (!v) return message;
  if (v.length > max) return `Use no máximo ${max} caracteres.`;
  return null;
}

export function validateAddress(a: Address): Partial<Record<keyof Address, string>> {
  const errors: Partial<Record<keyof Address, string>> = {};
  const set = (field: keyof Address, message: string | null) => {
    if (message) errors[field] = message;
  };
  set("recipient", required(a.recipient, "Informe quem vai receber.", 100));
  set("postalCode", /^\d{8}$/.test(a.postalCode ?? "") ? null : "Informe um CEP com 8 dígitos.");
  set("street", required(a.street, "Informe a rua.", 120));
  set("number", required(a.number, "Informe o número (ou S/N).", 10));
  set("district", required(a.district, "Informe o bairro.", 80));
  set("city", required(a.city, "Informe a cidade.", 80));
  set("state", isUF(a.state) ? null : "Escolha o estado.");
  if (a.complement && a.complement.trim().length > 60) errors.complement = "Use no máximo 60 caracteres.";
  return errors;
}
