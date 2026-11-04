import { getShippingRule } from "@/lib/api/server";
import { formatBRL } from "@/lib/format";

export async function AnnouncementBar() {
  const rule = await getShippingRule();
  if (rule.freeAboveCents === null) return null;
  return (
    <p className="bg-cream px-4 py-2 text-center text-[13px] text-rose-deep">
      Frete grátis acima de {formatBRL(rule.freeAboveCents)} para todo o Brasil
    </p>
  );
}
