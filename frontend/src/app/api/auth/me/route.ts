import { customerFromSession } from "@/lib/demo/accounts";
import { demoOnly } from "@/lib/demo/guard";
import { readSessionToken } from "@/lib/demo/session-cookie";

export async function GET() {
  const blocked = demoOnly();
  if (blocked) return blocked;

  const customer = customerFromSession(await readSessionToken());
  if (!customer) return Response.json({ title: "Sessão encerrada. Entre novamente." }, { status: 401 });
  return Response.json(customer);
}
