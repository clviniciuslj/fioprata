import { getShippingRule } from "@/lib/api/server";
import { formatBRL } from "@/lib/format";

export async function AnnouncementBar() {
  const rule = await getShippingRule();
  if (rule.freeAboveCents === null) return null;
  return (
    <p className="border-b border-line px-4 py-2 text-center text-[13px] text-ink-soft">
      Frete grátis acima de {formatBRL(rule.freeAboveCents)} para todo o Brasil
    </p>
  );
}
