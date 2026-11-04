import type { OrderDetail } from "@/lib/api/contract";
import { buildTimeline } from "@/lib/order-status";
import { formatDateTime } from "@/lib/format";
import { cx } from "@/lib/cx";

export function OrderTimeline({ order }: { order: Pick<OrderDetail, "status" | "history"> }) {
  const steps = buildTimeline(order);
  const notes = new Map(order.history.filter((e) => e.note).map((e) => [e.status, e.note]));

  return (
    <ol className="relative flex flex-col gap-6" aria-label="Andamento do pedido">
      {steps.map((step, i) => (
        <li key={step.status} className="relative grid grid-cols-[1.25rem_1fr] gap-4" aria-current={step.state === "current" ? "step" : undefined}>
          {i < steps.length - 1 && (
            <span
              aria-hidden="true"
              className={cx("absolute left-[9px] top-6 h-[calc(100%+0.5rem)] w-px", step.state === "done" ? "bg-ink" : "bg-line")}
            />
          )}
          <span
            aria-hidden="true"
            className={cx(
              "relative mt-1 size-[19px] rounded-full border",
              step.state === "done" && "border-ink bg-ink",
              step.state === "current" && "border-ink bg-paper ring-4 ring-mist",
              step.state === "upcoming" && "border-line bg-paper",
            )}
          />
          <div>
            <p className={cx("text-[15px]", step.state === "upcoming" ? "text-muted" : "text-ink", step.state === "current" && "font-medium")}>
              {step.label}
              {step.state === "upcoming" && <span className="sr-only"> (próxima etapa)</span>}
            </p>
            {step.at && <p className="text-sm text-muted">{formatDateTime(step.at)}</p>}
            {notes.get(step.status) && <p className="mt-1 text-sm text-ink-soft">{notes.get(step.status)}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
