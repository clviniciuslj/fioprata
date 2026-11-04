"use client";

import { useState } from "react";
import type { Customer } from "@/lib/api/contract";
import { cx } from "@/lib/cx";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";

export function IdentifyStep({ demo, onIdentified }: { demo: boolean; onIdentified: (customer: Customer) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div>
      <div className="inline-flex rounded-full border border-line bg-surface p-1" role="group" aria-label="Como continuar">
        {(
          [
            ["login", "Já tenho conta"],
            ["register", "Criar conta"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => setMode(value)}
            className={cx("h-9 rounded-full px-4 text-[15px] transition-colors", mode === value ? "bg-ink text-paper" : "text-ink-soft hover:text-ink")}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-6 max-w-md">
        {mode === "login" ? (
          <LoginForm demo={demo} onLoggedIn={onIdentified} />
        ) : (
          <RegisterForm submitLabel="Criar conta e continuar" onRegistered={(r) => onIdentified(r.customer)} />
        )}
      </div>
    </div>
  );
}
