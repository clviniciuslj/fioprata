import type { OrderDetail, OrderStatus } from "@/lib/api/contract";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  awaiting_payment: "Aguardando pagamento",
  payment_approved: "Pagamento aprovado",
  preparing: "Em preparação",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
  expired: "Expirado",
};

/** Caminho normal de um pedido; cancelado e expirado encerram o caminho onde ele estiver. */
const FLOW: OrderStatus[] = ["awaiting_payment", "payment_approved", "preparing", "shipped", "delivered"];

export interface TimelineStep {
  status: OrderStatus;
  label: string;
  state: "done" | "current" | "upcoming";
  at: string | null;
}

export function buildTimeline(order: Pick<OrderDetail, "status" | "history">): TimelineStep[] {
  const lastAt = (status: OrderStatus) => order.history.findLast((e) => e.status === status)?.at ?? null;
  const step = (status: OrderStatus, state: TimelineStep["state"]): TimelineStep => ({
    status,
    label: ORDER_STATUS_LABEL[status],
    state,
    at: state === "upcoming" ? null : lastAt(status),
  });

  const index = FLOW.indexOf(order.status);
  if (index >= 0) {
    return FLOW.map((status, i) => step(status, i < index ? "done" : i === index ? "current" : "upcoming"));
  }

  const reached = FLOW.filter((status) => order.history.some((e) => e.status === status));
  return [...reached.map((status) => step(status, "done")), step(order.status, "current")];
}
