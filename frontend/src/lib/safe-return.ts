const BASE = "https://loja.invalid";

/**
 * Aceita apenas caminhos internos para o redirecionamento depois do login,
 * evitando que um link manipulado (?voltar=//site-falso.com) leve o cliente para fora da loja.
 */
export function safeReturnPath(value: string | null | undefined, fallback = "/minha-conta"): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return fallback;
  // Caracteres de controle e barra invertida são normalizados pelos navegadores e abrem brechas.
  if (/[\u0000-\u001f\u007f\\]/.test(value)) return fallback;

  let decoded: string;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return fallback;
  }
  if (decoded.startsWith("//") || decoded.includes("\\")) return fallback;

  try {
    const url = new URL(value, BASE);
    if (url.origin !== BASE) return fallback;
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}
