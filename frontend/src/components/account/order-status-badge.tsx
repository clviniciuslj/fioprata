import type { OrderStatus } from "@/lib/api/contract";
import { ORDER_STATUS_LABEL } from "@/lib/order-status";
import { cx } from "@/lib/cx";

const tone: Record<OrderStatus, string> = {
  awaiting_payment: "border-ink text-ink",
  payment_approved: "border-ink text-ink",
  preparing: "border-ink text-ink",
  shipped: "border-ink bg-ink text-paper",
  delivered: "border-success text-success",
  cancelled: "border-line text-muted",
  expired: "border-line text-muted",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cx("inline-flex rounded-full border px-2.5 py-0.5 text-[13px] whitespace-nowrap", tone[status])}>
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}
