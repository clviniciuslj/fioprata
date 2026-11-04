import type { ForgotPasswordResponse } from "@/lib/api/contract";
import { requestPasswordReset } from "@/lib/demo/accounts";
import { demoOnly, readJson } from "@/lib/demo/guard";
import { validateEmail } from "@/lib/validation";

export async function POST(request: Request) {
  const blocked = demoOnly();
  if (blocked) return blocked;

  const body = (await readJson(request)) as Record<string, unknown> | undefined;
  const email = String(body?.email ?? "");
  const emailError = validateEmail(email);
  if (emailError) return Response.json({ title: emailError, errors: { email: [emailError] } }, { status: 400 });

  // A resposta é a mesma exista ou não a conta. Só a demonstração devolve o link que iria por e-mail.
  const token = requestPasswordReset(email);
  const response: ForgotPasswordResponse = token ? { demoResetPath: `/redefinir-senha?token=${token}` } : {};
  return Response.json(response);
}
