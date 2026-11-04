import { destroySession } from "@/lib/demo/accounts";
import { demoOnly } from "@/lib/demo/guard";
import { clearSessionCookie, readSessionToken } from "@/lib/demo/session-cookie";

export async function POST() {
  const blocked = demoOnly();
  if (blocked) return blocked;

  destroySession(await readSessionToken());
  await clearSessionCookie();
  return new Response(null, { status: 204 });
}
