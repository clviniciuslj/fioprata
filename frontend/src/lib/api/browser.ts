import type { ApiError, CartQuote, CartQuoteRequest } from "./contract";

/**
 * Chamadas feitas pelo navegador. Sempre para `/api/*` no mesmo domínio:
 * hoje atendidas pelas rotas de demonstração, depois repassadas à API ASP.NET.
 */

export type Result<T> = { ok: true; data: T } | { ok: false; status: number; error: ApiError };

const NETWORK_ERROR: ApiError = { title: "Não foi possível conectar. Verifique sua internet e tente novamente." };
const UNEXPECTED_ERROR: ApiError = { title: "Algo deu errado do nosso lado. Tente novamente em instantes." };

async function request<T>(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
  headers: Record<string, string> = {},
): Promise<Result<T>> {
  let response: Response;
  try {
    response = await fetch(path, {
      method,
      credentials: "same-origin",
      cache: "no-store",
      headers: { Accept: "application/json", ...(body !== undefined && { "Content-Type": "application/json" }), ...headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    return { ok: false, status: 0, error: NETWORK_ERROR };
  }

  const data: unknown = response.status === 204 ? null : await response.json().catch(() => null);
  if (response.ok) return { ok: true, data: data as T };

  const error = data && typeof data === "object" && "title" in data ? (data as ApiError) : UNEXPECTED_ERROR;
  return { ok: false, status: response.status, error };
}

export const browserApi = {
  quoteCart: (req: CartQuoteRequest) => request<CartQuote>("POST", "/api/cart/quote", req),
};
