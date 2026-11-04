import { confirmEmail } from "@/lib/demo/accounts";
import { demoOnly, readJson } from "@/lib/demo/guard";

export async function POST(request: Request) {
  const blocked = demoOnly();
  if (blocked) return blocked;

  const body = (await readJson(request)) as Record<string, unknown> | undefined;
  if (!confirmEmail(String(body?.token ?? ""))) {
    return Response.json({ title: "Este link de confirmação não é mais válido." }, { status: 400 });
  }
  return new Response(null, { status: 204 });
}
