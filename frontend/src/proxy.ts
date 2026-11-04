import { NextResponse, type NextRequest } from "next/server";
import { DEMO_SESSION_COOKIE } from "@/lib/demo/constants";

/**
 * Verificação otimista: sem cookie de sessão, a área do cliente nem renderiza e o visitante
 * vai direto para o login. A verificação de verdade acontece na página e na API.
 */
export function proxy(request: NextRequest) {
  if (process.env.STORE_DATA_SOURCE === "api") return NextResponse.next();
  if (request.cookies.has(DEMO_SESSION_COOKIE)) return NextResponse.next();

  const login = new URL("/entrar", request.url);
  login.searchParams.set("voltar", request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/minha-conta", "/minha-conta/:path*"],
};
