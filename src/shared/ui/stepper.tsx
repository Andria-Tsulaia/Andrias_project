import { Minus, Plus } from "lucide-react";

import { t } from "@/content/ka";
import { cn } from "@/lib/utils";

type StepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
};

/** რაოდენობის არჩევა — ზღვრებზე ღილაკები თიშავს თავს */
export function Stepper({ value, onChange, min = 1, max = 99, disabled = false, size = "md", className }: StepperProps) {
  const decreaseDisabled = disabled || value <= min;
  const increaseDisabled = disabled || value >= max;
  const buttonSize = size === "sm" ? "size-8" : "size-10";

  return (
    <div
      className={cn("inline-flex items-center rounded-md border border-input bg-card", className)}
      role="group"
      aria-label={t.product.quantity}
    >
      <button
        type="button"
        aria-label={t.product.decrease}
        disabled={decreaseDisabled}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cn(
          "flex items-center justify-center rounded-l-md text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40",
          buttonSize,
        )}
      >
        <Minus aria-hidden="true" className="size-4" />
      </button>
      <span
        aria-live="polite"
        className={cn("min-w-10 select-none text-center text-sm font-semibold tabular-nums", size === "sm" && "min-w-8")}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label={t.product.increase}
        disabled={increaseDisabled}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={cn(
          "flex items-center justify-center rounded-r-md text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40",
          buttonSize,
        )}
      >
        <Plus aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
