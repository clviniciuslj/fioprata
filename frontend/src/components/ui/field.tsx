"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { cx } from "@/lib/cx";

const control =
  "block w-full rounded-[10px] border bg-surface px-4 text-base text-ink placeholder:text-muted/70 " +
  "transition-colors duration-150 focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-focus " +
  "disabled:bg-mist disabled:text-muted";

interface FieldShellProps {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: (ids: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
}

function FieldShell({ label, hint, error, className, children }: FieldShellProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[15px] text-ink-soft">
        {label}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && !error && (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

type TextFieldProps = Omit<ComponentProps<"input">, "id"> & { label: string; hint?: string; error?: string };

export function TextField({ label, hint, error, className, ...input }: TextFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} className={className}>
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={cx(control, "h-12", invalid ? "border-danger" : "border-line")}
          {...input}
        />
      )}
    </FieldShell>
  );
}

type SelectFieldProps = Omit<ComponentProps<"select">, "id"> & { label: string; hint?: string; error?: string };

export function SelectField({ label, hint, error, className, children, ...select }: SelectFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} className={className}>
      {({ id, describedBy, invalid }) => (
        <select
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={cx(control, "h-12 appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10", invalid ? "border-danger" : "border-line")}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%2323272c' stroke-width='1.5'/%3E%3C/svg%3E\")",
          }}
          {...select}
        >
          {children}
        </select>
      )}
    </FieldShell>
  );
}
