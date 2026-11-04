import type { ReactNode } from "react";

/** Tipografia de textos longos (políticas): medida confortável, títulos e listas espaçados. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      className={
        "max-w-[68ch] text-[17px] leading-[1.75] text-ink-soft " +
        "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:leading-tight [&_h2]:text-ink " +
        "[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-[17px] [&_h3]:font-medium [&_h3]:text-ink " +
        "[&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 " +
        "[&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_strong]:font-medium [&_strong]:text-ink"
      }
    >
      {children}
    </div>
  );
}

export function LegalReviewNotice() {
  return (
    <p role="note" className="mt-8 max-w-[68ch] rounded-[10px] border border-line bg-surface px-5 py-4 text-[15px] text-ink-soft">
      Texto-modelo. Antes da publicação, os campos entre colchetes precisam ser preenchidos e o conteúdo revisado por
      um profissional jurídico.
    </p>
  );
}
