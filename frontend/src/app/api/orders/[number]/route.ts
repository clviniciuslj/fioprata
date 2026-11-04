import { customerFromSession } from "@/lib/demo/accounts";
import { demoOnly } from "@/lib/demo/guard";
import { getOrderFor } from "@/lib/demo/orders";
import { readSessionToken } from "@/lib/demo/session-cookie";

export async function GET(_request: Request, { params }: RouteContext<"/api/orders/[number]">) {
  const blocked = demoOnly();
  if (blocked) return blocked;

  const customer = customerFromSession(await readSessionToken());
  if (!customer) return Response.json({ title: "Entre na sua conta para continuar." }, { status: 401 });

  const order = getOrderFor(customer.id, (await params).number);
  if (!order) return Response.json({ title: "Pedido não encontrado." }, { status: 404 });
  return Response.json(order);
}
