import type { ProductSpec } from "@/lib/api/contract";

export function ProductSpecs({ specs }: { specs: ProductSpec[] }) {
  return (
    <dl className="divide-y divide-line border-y border-line text-[15px]">
      {specs.map((s) => (
        <div key={s.label} className="grid grid-cols-[10rem_1fr] gap-4 py-3">
          <dt className="text-muted">{s.label}</dt>
          <dd className="text-ink">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
