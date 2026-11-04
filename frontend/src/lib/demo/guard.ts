import "server-only";
import { dataSource } from "@/lib/api/data-source";

const MAX_BODY_BYTES = 16 * 1024;

/** Rotas de demonstração só existem em modo demonstração; fora dele respondem 404. */
export function demoOnly(): Response | null {
  if (dataSource() === "demo") return null;
  return Response.json({ title: "Não encontrado." }, { status: 404 });
}

/** Lê o corpo JSON com limite de tamanho; devolve `undefined` se ausente, grande demais ou malformado. */
export async function readJson(request: Request): Promise<unknown> {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) return undefined;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return undefined;
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}
