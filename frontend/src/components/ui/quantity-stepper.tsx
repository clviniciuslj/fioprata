"use client";

interface Props {
  value: number;
  max: number;
  onChange: (value: number) => void;
  label?: string;
  min?: number;
}

export function QuantityStepper({ value, max, onChange, label = "Quantidade", min = 1 }: Props) {
  return (
    <div className="inline-flex h-11 items-center rounded-full border border-line bg-surface" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="inline-flex size-11 items-center justify-center text-lg disabled:text-muted/50"
        aria-label="Diminuir quantidade"
      >
        −
      </button>
      <span className="w-8 text-center tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="inline-flex size-11 items-center justify-center text-lg disabled:text-muted/50"
        aria-label="Aumentar quantidade"
      >
        +
      </button>
    </div>
  );
}
