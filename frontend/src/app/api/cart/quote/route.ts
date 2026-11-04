import { demoOnly, readJson } from "@/lib/demo/guard";
import { parseCartQuoteRequest, quoteCart } from "@/lib/demo/quote";

export async function POST(request: Request) {
  const blocked = demoOnly();
  if (blocked) return blocked;

  const parsed = parseCartQuoteRequest(await readJson(request));
  if (!parsed.ok) return Response.json(parsed.error, { status: 400 });
  return Response.json(quoteCart(parsed.value));
}
