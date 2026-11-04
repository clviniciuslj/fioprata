"use client";

import { useEffect, useState } from "react";
import { browserApi } from "@/lib/api/browser";
import { ButtonLink } from "@/components/ui/button";
import { currentSearchParam } from "./auth-shell";

type Status = "checking" | "confirmed" | "invalid";

/** Confirma no carregamento da página, a partir do token do link. */
export function ConfirmEmail() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let cancelled = false;
    const token = currentSearchParam("token") ?? "";
    browserApi.confirmEmail(token).then((result) => {
      if (!cancelled) setStatus(result.ok ? "confirmed" : "invalid");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "checking") return <p className="text-[17px] text-ink-soft" role="status">Confirmando seu e-mail…</p>;

  if (status === "invalid") {
    return (
      <div className="flex flex-col gap-5" role="alert">
        <p className="text-[17px] text-ink-soft">Este link de confirmação não é mais válido. Ele pode já ter sido usado.</p>
        <ButtonLink href="/minha-conta" variant="secondary" className="self-start">
          Ir para minha conta
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5" role="status">
      <p className="text-[17px] text-ink-soft">E-mail confirmado. Obrigado!</p>
      <ButtonLink href="/produtos" className="self-start">
        Ver as peças
      </ButtonLink>
    </div>
  );
}
