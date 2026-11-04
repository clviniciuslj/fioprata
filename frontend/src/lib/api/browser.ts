import type {
  ApiError,
  CartQuote,
  CartQuoteRequest,
  CreateOrderRequest,
  CreateOrderResponse,
  Customer,
  ForgotPasswordResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from "./contract";

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

  register: (req: RegisterRequest) => request<RegisterResponse>("POST", "/api/auth/register", req),
  login: (req: LoginRequest) => request<Customer>("POST", "/api/auth/login", req),
  logout: () => request<null>("POST", "/api/auth/logout"),
  me: () => request<Customer>("GET", "/api/auth/me"),
  confirmEmail: (token: string) => request<null>("POST", "/api/auth/confirm-email", { token }),
  forgotPassword: (email: string) => request<ForgotPasswordResponse>("POST", "/api/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) => request<null>("POST", "/api/auth/reset-password", { token, password }),

  /** A mesma chave em novas tentativas garante que o servidor nunca crie dois pedidos para o mesmo clique. */
  createOrder: (req: CreateOrderRequest, idempotencyKey: string) =>
    request<CreateOrderResponse>("POST", "/api/orders", req, { "Idempotency-Key": idempotencyKey }),
};
