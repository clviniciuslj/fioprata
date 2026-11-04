import { formatBRL } from "@/lib/format";
import { cx } from "@/lib/cx";

export function Price({ cents, fromPrice, className }: { cents: number; fromPrice?: boolean; className?: string }) {
  return (
    <span className={cx("tabular-nums", className)}>
      {fromPrice && <span className="text-muted">a partir de </span>}
      {formatBRL(cents)}
    </span>
  );
}
