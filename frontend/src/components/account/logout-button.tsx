"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { browserApi } from "@/lib/api/browser";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    await browserApi.logout();
    router.replace("/");
    router.refresh();
  }

  return (
    <button type="button" onClick={logout} disabled={pending} className="text-[15px] text-ink-soft underline underline-offset-4 hover:text-ink disabled:opacity-50">
      {pending ? "Saindo…" : "Sair"}
    </button>
  );
}
