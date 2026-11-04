import { dataSource } from "@/lib/api/data-source";

export const DEMO_BANNER_TEXT = "Ambiente de demonstração — produtos, contas e pedidos são fictícios.";

export function DemoBanner() {
  if (dataSource() !== "demo") return null;
  return (
    <div role="note" className="bg-ink px-4 py-1.5 text-center text-[13px] text-paper">
      {DEMO_BANNER_TEXT}
    </div>
  );
}
