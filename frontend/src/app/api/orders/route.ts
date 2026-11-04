import type { Address, CreateOrderResponse } from "@/lib/api/contract";
import { customerFromSession } from "@/lib/demo/accounts";
import { demoOnly, readJson } from "@/lib/demo/guard";
import { createDemoOrder, listOrdersFor } from "@/lib/demo/orders";
import { parseCartItems } from "@/lib/demo/quote";
import { readSessionToken } from "@/lib/demo/session-cookie";

const UNAUTHORIZED = { title: "Entre na sua conta para continuar." };

export async function GET() {
  const blocked = demoOnly();
  if (blocked) return blocked;

  const customer = customerFromSession(await readSessionToken());
  if (!customer) return Response.json(UNAUTHORIZED, { status: 401 });
  return Response.json(listOrdersFor(customer.id));
}

export async function POST(request: Request) {
  const blocked = demoOnly();
  if (blocked) return blocked;

  const customer = customerFromSession(await readSessionToken());
  if (!customer) return Response.json(UNAUTHORIZED, { status: 401 });

  const key = request.headers.get("idempotency-key") ?? "";
  if (!/^[A-Za-z0-9-]{8,100}$/.test(key)) {
    return Response.json({ title: "Cabeçalho Idempotency-Key ausente ou inválido." }, { status: 400 });
  }

  const body = (await readJson(request)) as Record<string, unknown> | undefined;
  const items = parseCartItems(body?.items);
  if (!items.ok) return Response.json(items.error, { status: 400 });
  if (!body?.address || typeof body.address !== "object") {
    return Response.json({ title: "Informe o endereço de entrega." }, { status: 400 });
  }
  const raw = body.address as Record<string, unknown>;
  const address = Object.fromEntries(
    ["recipient", "postalCode", "street", "number", "complement", "district", "city", "state"].map((f) => [f, String(raw[f] ?? "")]),
  ) as unknown as Address;

  const result = createDemoOrder(customer.id, { items: items.value, address }, key);
  if (!result.ok) return Response.json(result.error, { status: result.status });

  const { number, status, totalCents, reservedUntil } = result.order;
  const response: CreateOrderResponse = { number, status, totalCents, reservedUntil };
  return Response.json(response, { status: 201 });
}
