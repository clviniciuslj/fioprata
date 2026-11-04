import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10", className)}>{children}</div>;
}
