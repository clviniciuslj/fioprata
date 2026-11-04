import { resetPassword } from "@/lib/demo/accounts";
import { demoOnly, readJson } from "@/lib/demo/guard";

export async function POST(request: Request) {
  const blocked = demoOnly();
  if (blocked) return blocked;

  const body = (await readJson(request)) as Record<string, unknown> | undefined;
  const result = resetPassword(String(body?.token ?? ""), String(body?.password ?? ""));
  if (!result.ok) return Response.json(result.error, { status: 400 });
  return new Response(null, { status: 204 });
}
