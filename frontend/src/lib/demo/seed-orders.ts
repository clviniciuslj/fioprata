import type { Address, OrderEvent, OrderLine, OrderStatus } from "@/lib/api/contract";
import { demoProducts } from "./catalog-data";

/** Pedidos de exemplo do cliente demo, um em cada situação, para mostrar o acompanhamento. */

const address: Address = {
  recipient: "Cliente Exemplo",
  postalCode: "01310100",
  street: "Avenida Paulista",
  number: "1000",
  complement: "Apto 12",
  district: "Bela Vista",
  city: "São Paulo",
  state: "SP",
};

function line(variantId: string, quantity: number): OrderLine {
  for (const p of demoProducts) {
    const v = p.variants.find((x) => x.id === variantId);
    if (v) {
      return {
        productName: p.name,
        variantLabel: v.label,
        sku: v.sku,
        image: { src: `/demo-art/${p.slug}.webp`, alt: `Ilustração provisória: ${p.name}` },
        unitPriceCents: v.priceCents,
        quantity,
        lineTotalCents: v.priceCents * quantity,
      };
    }
  }
  throw new Error(`Variação de exemplo inexistente: ${variantId}`);
}

function order(number: string, status: OrderStatus, lines: OrderLine[], history: OrderEvent[], trackingCode: string | null = null) {
  const subtotalCents = lines.reduce((s, l) => s + l.lineTotalCents, 0);
  const shippingCents = subtotalCents >= 39900 ? 0 : 1490;
  return {
    customerId: "c-demo",
    number,
    createdAt: history[0].at,
    status,
    lines,
    itemCount: lines.reduce((s, l) => s + l.quantity, 0),
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
    address,
    reservedUntil: null,
    history,
    trackingCode,
  };
}

export const seedOrders = [
  order(
    "P-104801",
    "delivered",
    [line("p07-45", 1), line("p17-u", 1)],
    [
      { status: "awaiting_payment", at: "2026-09-20T13:05:00.000Z" },
      { status: "payment_approved", at: "2026-09-20T13:40:00.000Z" },
      { status: "preparing", at: "2026-09-21T11:00:00.000Z" },
      { status: "shipped", at: "2026-09-22T17:20:00.000Z" },
      { status: "delivered", at: "2026-09-26T15:10:00.000Z" },
    ],
    "AB123456789BR",
  ),
  order(
    "P-104812",
    "shipped",
    [line("p14-u", 1), line("p10-u", 1)],
    [
      { status: "awaiting_payment", at: "2026-10-28T19:30:00.000Z" },
      { status: "payment_approved", at: "2026-10-28T19:52:00.000Z" },
      { status: "preparing", at: "2026-10-29T12:00:00.000Z" },
      { status: "shipped", at: "2026-10-30T18:45:00.000Z" },
    ],
    "AB987654321BR",
  ),
  order(
    "P-104815",
    "cancelled",
    [line("p03-a16", 1)],
    [
      { status: "awaiting_payment", at: "2026-10-15T14:00:00.000Z" },
      { status: "cancelled", at: "2026-10-15T14:20:00.000Z", note: "Cancelado a pedido do cliente." },
    ],
  ),
  order(
    "P-104818",
    "expired",
    [line("p06-40", 1)],
    [
      { status: "awaiting_payment", at: "2026-10-30T22:10:00.000Z" },
      { status: "expired", at: "2026-10-30T22:40:00.000Z", note: "A reserva expirou sem confirmação de pagamento." },
    ],
  ),
];
