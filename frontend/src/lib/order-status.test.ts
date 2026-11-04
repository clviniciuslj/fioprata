import { describe, expect, it } from "vitest";
import type { OrderEvent } from "@/lib/api/contract";
import { ORDER_STATUS_LABEL, buildTimeline } from "./order-status";

const at = (day: number) => `2026-10-${String(day).padStart(2, "0")}T12:00:00.000Z`;

describe("ORDER_STATUS_LABEL", () => {
  it("traduz todos os status", () => {
    expect(ORDER_STATUS_LABEL).toEqual({
      awaiting_payment: "Aguardando pagamento",
      payment_approved: "Pagamento aprovado",
      preparing: "Em preparação",
      shipped: "Enviado",
      delivered: "Entregue",
      cancelled: "Cancelado",
      expired: "Expirado",
    });
  });
});

describe("buildTimeline", () => {
  it("pedido enviado: etapas anteriores concluídas, envio atual, entrega por vir", () => {
    const history: OrderEvent[] = [
      { status: "awaiting_payment", at: at(1) },
      { status: "payment_approved", at: at(2) },
      { status: "preparing", at: at(3) },
      { status: "shipped", at: at(4) },
    ];
    expect(buildTimeline({ status: "shipped", history })).toEqual([
      { status: "awaiting_payment", label: "Aguardando pagamento", state: "done", at: at(1) },
      { status: "payment_approved", label: "Pagamento aprovado", state: "done", at: at(2) },
      { status: "preparing", label: "Em preparação", state: "done", at: at(3) },
      { status: "shipped", label: "Enviado", state: "current", at: at(4) },
      { status: "delivered", label: "Entregue", state: "upcoming", at: null },
    ]);
  });

  it("cancelado depois do pagamento: só as etapas alcançadas e o cancelamento", () => {
    const history: OrderEvent[] = [
      { status: "awaiting_payment", at: at(1) },
      { status: "payment_approved", at: at(2) },
      { status: "cancelled", at: at(3) },
    ];
    expect(buildTimeline({ status: "cancelled", history }).map((s) => [s.status, s.state])).toEqual([
      ["awaiting_payment", "done"],
      ["payment_approved", "done"],
      ["cancelled", "current"],
    ]);
  });

  it("expirado: aguardando pagamento concluído e expiração atual", () => {
    const history: OrderEvent[] = [
      { status: "awaiting_payment", at: at(1) },
      { status: "expired", at: at(1) },
    ];
    expect(buildTimeline({ status: "expired", history }).map((s) => [s.status, s.state, s.at])).toEqual([
      ["awaiting_payment", "done", at(1)],
      ["expired", "current", at(1)],
    ]);
  });

  it("recém-criado: primeira etapa atual e as demais por vir", () => {
    const steps = buildTimeline({ status: "awaiting_payment", history: [{ status: "awaiting_payment", at: at(5) }] });
    expect(steps[0]).toMatchObject({ state: "current", at: at(5) });
    expect(steps.slice(1).every((s) => s.state === "upcoming")).toBe(true);
  });
});
