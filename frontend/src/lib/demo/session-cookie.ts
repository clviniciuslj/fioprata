import "server-only";
import { cookies } from "next/headers";
import { DEMO_SESSION_COOKIE } from "./store";

const ONE_WEEK = 60 * 60 * 24 * 7;

/** Cookie HttpOnly: o JavaScript da página nunca enxerga a sessão, como no fluxo real com o Identity. */
export async function setSessionCookie(token: string) {
  (await cookies()).set(DEMO_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_WEEK,
  });
}

export async function readSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(DEMO_SESSION_COOKIE)?.value;
}

export async function clearSessionCookie() {
  (await cookies()).delete(DEMO_SESSION_COOKIE);
}
