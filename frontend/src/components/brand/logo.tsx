import type { CSSProperties } from "react";
import { brand } from "@/config/brand";
import { cx } from "@/lib/cx";

/** Vetores redesenhados a partir de docs/marca/logo-referencia.jpeg. A cor vem de `color` (text-*). */
const MARKS = {
  wordmark: { src: "/brand/bellie-wordmark.svg", ratio: "2904 / 948" },
  bow: { src: "/brand/bellie-bow.svg", ratio: "872 / 448" },
  full: { src: "/brand/bellie-full.svg", ratio: "2904 / 2280" },
} as const;

function Mark({ kind, className }: { kind: keyof typeof MARKS; className?: string }) {
  const mark = MARKS[kind];
  return (
    <span
      aria-hidden="true"
      className={cx("brand-mark", className)}
      style={{ "--mark": `url(${mark.src})`, aspectRatio: mark.ratio } as CSSProperties}
    />
  );
}

/** Nome com o laço embaixo, para o cabeçalho. */
export function LogoCompact({ className }: { className?: string }) {
  return (
    <span role="img" aria-label={brand.name} className={cx("inline-flex flex-col items-center gap-[3px]", className)}>
      <Mark kind="wordmark" className="h-7 lg:h-9" />
      <Mark kind="bow" className="h-3 lg:h-4" />
    </span>
  );
}

/** Logotipo completo: estrela, nome, "Prata 925" e laço. */
export function LogoFull({ className }: { className?: string }) {
  return (
    <span role="img" aria-label={`${brand.name}, prata 925`} className={cx("inline-block", className)}>
      <Mark kind="full" className="h-full" />
    </span>
  );
}
