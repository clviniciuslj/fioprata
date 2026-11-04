import { authenticate, createSession } from "@/lib/demo/accounts";
import { demoOnly, readJson } from "@/lib/demo/guard";
import { setSessionCookie } from "@/lib/demo/session-cookie";

export async function POST(request: Request) {
  const blocked = demoOnly();
  if (blocked) return blocked;

  const body = (await readJson(request)) as Record<string, unknown> | undefined;
  const email = String(body?.email ?? "");
  const password = String(body?.password ?? "");
  if (!email.trim() || !password) {
    return Response.json({ title: "Informe e-mail e senha." }, { status: 400 });
  }

  const customer = authenticate(email, password);
  // Mensagem única para e-mail inexistente e senha errada: não revela quais contas existem.
  if (!customer) return Response.json({ title: "E-mail ou senha incorretos." }, { status: 401 });

  await setSessionCookie(createSession(customer.id));
  return Response.json(customer);
}
