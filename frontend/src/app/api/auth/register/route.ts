import type { RegisterResponse } from "@/lib/api/contract";
import { createSession, registerCustomer } from "@/lib/demo/accounts";
import { demoOnly, readJson } from "@/lib/demo/guard";
import { setSessionCookie } from "@/lib/demo/session-cookie";

export async function POST(request: Request) {
  const blocked = demoOnly();
  if (blocked) return blocked;

  const body = (await readJson(request)) as Record<string, unknown> | undefined;
  const result = registerCustomer({
    name: String(body?.name ?? ""),
    email: String(body?.email ?? ""),
    password: String(body?.password ?? ""),
  });
  if (!result.ok) return Response.json(result.error, { status: 400 });

  await setSessionCookie(createSession(result.customer.id));
  const response: RegisterResponse = {
    customer: result.customer,
    demoConfirmationPath: `/confirmar-email?token=${result.confirmToken}`,
  };
  return Response.json(response, { status: 201 });
}
