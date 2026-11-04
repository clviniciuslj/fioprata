import { describe, expect, it } from "vitest";
import {
  authenticate,
  confirmEmail,
  createSession,
  customerFromSession,
  destroySession,
  registerCustomer,
  requestPasswordReset,
  resetPassword,
} from "./accounts";

let seq = 0;
const uniqueEmail = () => `teste${++seq}-${Date.now()}@example.com`;

describe("registerCustomer", () => {
  it("cria a conta com e-mail ainda não confirmado", () => {
    const email = uniqueEmail();
    const result = registerCustomer({ name: "Maria", email, password: "1234567890" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.customer).toMatchObject({ name: "Maria", email, emailConfirmed: false });
      expect(result.confirmToken).toBeTruthy();
    }
  });

  it("recusa e-mail já cadastrado sem diferenciar maiúsculas", () => {
    const email = uniqueEmail();
    registerCustomer({ name: "Maria", email, password: "1234567890" });
    const again = registerCustomer({ name: "Outra", email: email.toUpperCase(), password: "1234567890" });
    expect(again.ok).toBe(false);
    if (!again.ok) expect(again.error.errors).toHaveProperty("email");
  });

  it("recusa dados inválidos", () => {
    const result = registerCustomer({ name: "M", email: "x", password: "123" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.error.errors ?? {}).sort()).toEqual(["email", "name", "password"]);
  });
});

describe("sessões", () => {
  it("autentica e-mail cadastrado e devolve null para desconhecido", () => {
    expect(authenticate("cliente@example.com", "qualquer-senha")?.name).toBe("Cliente Exemplo");
    expect(authenticate("ninguem@example.com", "qualquer-senha")).toBeNull();
  });

  it("cria, lê e encerra uma sessão", () => {
    const customer = authenticate("cliente@example.com", "x")!;
    const token = createSession(customer.id);
    expect(customerFromSession(token)?.id).toBe(customer.id);
    destroySession(token);
    expect(customerFromSession(token)).toBeNull();
  });

  it("não aceita sessão inexistente", () => {
    expect(customerFromSession(undefined)).toBeNull();
    expect(customerFromSession("inventado")).toBeNull();
  });
});

describe("confirmEmail", () => {
  it("confirma com o token certo, uma única vez", () => {
    const result = registerCustomer({ name: "Ana", email: uniqueEmail(), password: "1234567890" });
    if (!result.ok) throw new Error("cadastro falhou");
    expect(confirmEmail(result.confirmToken)).toBe(true);
    expect(confirmEmail(result.confirmToken)).toBe(false);
    const token = createSession(result.customer.id);
    expect(customerFromSession(token)?.emailConfirmed).toBe(true);
  });
});

describe("recuperação de senha", () => {
  it("não cria token nem lança erro para e-mail desconhecido", () => {
    expect(requestPasswordReset("ninguem@example.com")).toBeNull();
  });

  it("redefine a senha com o token e encerra as sessões abertas", () => {
    const result = registerCustomer({ name: "Bia", email: uniqueEmail(), password: "1234567890" });
    if (!result.ok) throw new Error("cadastro falhou");
    const session = createSession(result.customer.id);
    const token = requestPasswordReset(result.customer.email)!;
    expect(resetPassword(token, "nova-senha-123")).toEqual({ ok: true });
    expect(customerFromSession(session)).toBeNull();
    expect(resetPassword(token, "nova-senha-123").ok).toBe(false);
  });

  it("recusa senha curta na redefinição sem consumir o token", () => {
    const result = registerCustomer({ name: "Cris", email: uniqueEmail(), password: "1234567890" });
    if (!result.ok) throw new Error("cadastro falhou");
    const token = requestPasswordReset(result.customer.email)!;
    expect(resetPassword(token, "curta").ok).toBe(false);
    expect(resetPassword(token, "agora-sim-123").ok).toBe(true);
  });
});
