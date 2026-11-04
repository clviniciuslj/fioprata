import { describe, expect, it } from "vitest";
import type { Address } from "@/lib/api/contract";
import { RESERVATION_MINUTES, createDemoOrder, getOrderFor, listOrdersFor } from "./orders";

const address: Address = {
  recipient: "Maria Silva",
  postalCode: "01310100",
  street: "Avenida Paulista",
  number: "1000",
  district: "Bela Vista",
  city: "São Paulo",
  state: "SP",
};

let seq = 0;
const newCustomer = () => `c-teste-pedidos-${++seq}-${Date.now()}`;
const NOW = new Date("2026-11-04T15:00:00.000Z");

// p01-a16 Anel Aparador Liso, Aro 16: R$ 89,00, 6 disponíveis · p12-u Brinco Ponto de Luz: 1 disponível
describe("createDemoOrder", () => {
  it("cria o pedido aguardando pagamento, com reserva e preços do servidor", () => {
    const result = createDemoOrder(newCustomer(), { items: [{ variantId: "p01-a16", quantity: 2 }], address }, "chave-1", NOW);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const order = result.order;
    expect(order.number).toMatch(/^P-\d{6}$/);
    expect(order.status).toBe("awaiting_payment");
    expect(order.lines[0]).toMatchObject({ unitPriceCents: 8900, quantity: 2, lineTotalCents: 17800, sku: "AN-APL-16" });
    expect(order.subtotalCents).toBe(17800);
    expect(order.shippingCents).toBe(1490);
    expect(order.totalCents).toBe(17800 + 1490);
    expect(order.reservedUntil).toBe(new Date(NOW.getTime() + RESERVATION_MINUTES * 60_000).toISOString());
    expect(RESERVATION_MINUTES).toBe(30);
    expect(order.history).toEqual([{ status: "awaiting_payment", at: NOW.toISOString() }]);
  });

  it("repetir a mesma chave devolve o mesmo pedido sem criar outro", () => {
    const customer = newCustomer();
    const req = { items: [{ variantId: "p01-a16", quantity: 1 }], address };
    const first = createDemoOrder(customer, req, "chave-repetida", NOW);
    const second = createDemoOrder(customer, req, "chave-repetida", NOW);
    expect(first.ok && second.ok).toBe(true);
    if (!first.ok || !second.ok) return;
    expect(second.order.number).toBe(first.order.number);
    expect(listOrdersFor(customer)).toHaveLength(1);
  });

  it("chave diferente cria outro pedido", () => {
    const customer = newCustomer();
    const req = { items: [{ variantId: "p01-a16", quantity: 1 }], address };
    createDemoOrder(customer, req, "chave-a", NOW);
    createDemoOrder(customer, req, "chave-b", NOW);
    expect(listOrdersFor(customer)).toHaveLength(2);
  });

  it("recusa com 409 quando falta estoque, sem criar pedido", () => {
    const customer = newCustomer();
    const result = createDemoOrder(customer, { items: [{ variantId: "p12-u", quantity: 3 }], address }, "chave-x", NOW);
    expect(result).toMatchObject({ ok: false, status: 409 });
    expect(listOrdersFor(customer)).toHaveLength(0);
  });

  it("recusa com 400 e aponta o CEP inválido", () => {
    const result = createDemoOrder(newCustomer(), { items: [{ variantId: "p01-a16", quantity: 1 }], address: { ...address, postalCode: "0131010" } }, "chave-y", NOW);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.status).toBe(400);
    expect(result.error.errors).toHaveProperty("postalCode");
  });

  it("recusa carrinho vazio", () => {
    const result = createDemoOrder(newCustomer(), { items: [], address }, "chave-z", NOW);
    expect(result).toMatchObject({ ok: false, status: 400 });
  });
});

describe("getOrderFor", () => {
  it("devolve o pedido ao próprio cliente", () => {
    const customer = newCustomer();
    const created = createDemoOrder(customer, { items: [{ variantId: "p01-a16", quantity: 1 }], address }, "chave-dono", NOW);
    if (!created.ok) throw new Error("pedido não criado");
    expect(getOrderFor(customer, created.order.number)?.number).toBe(created.order.number);
  });

  it("nunca devolve o pedido de outro cliente", () => {
    const created = createDemoOrder(newCustomer(), { items: [{ variantId: "p01-a16", quantity: 1 }], address }, "chave-alheia", NOW);
    if (!created.ok) throw new Error("pedido não criado");
    expect(getOrderFor(newCustomer(), created.order.number)).toBeNull();
  });

  it("devolve null para número inexistente", () => {
    expect(getOrderFor("c-demo", "P-000000")).toBeNull();
  });
});

describe("pedidos de exemplo do cliente demo", () => {
  it("existem em vários status para mostrar o acompanhamento", () => {
    const statuses = listOrdersFor("c-demo").map((o) => o.status);
    expect(statuses).toEqual(expect.arrayContaining(["delivered", "shipped", "cancelled", "expired"]));
  });
});
