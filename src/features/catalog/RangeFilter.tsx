import { useEffect, useState } from "react";

import { t } from "@/content/ka";
import { RangeSlider } from "@/shared/ui/range-slider";
import type { FilterDef } from "@/api/types";

type RangeFilterProps = {
  def: FilterDef;
  value: { min?: number; max?: number };
  onCommit: (range: { min?: number; max?: number }) => void;
};

const formatValue = (value: number, unit?: string) =>
  `${new Intl.NumberFormat("ka-GE", { maximumFractionDigits: 0 }).format(value)}${unit ? ` ${unit}` : ""}`;

/** ფასის დიაპაზონი — მოთხოვნა იგზავნება მხოლოდ გაშვებისას (onValueCommit) */
export function RangeFilter({ def, value, onCommit }: RangeFilterProps) {
  const bounds = { min: def.min ?? 0, max: def.max ?? 0 };
  const [local, setLocal] = useState<[number, number]>([value.min ?? bounds.min, value.max ?? bounds.max]);

  useEffect(() => {
    setLocal([value.min ?? bounds.min, value.max ?? bounds.max]);
  }, [value.min, value.max, bounds.min, bounds.max]);

  const commit = (next: [number, number]) => {
    onCommit({
      min: next[0] > bounds.min ? next[0] : undefined,
      max: next[1] < bounds.max ? next[1] : undefined,
    });
  };

  const reset = () => {
    setLocal([bounds.min, bounds.max]);
    onCommit({ min: undefined, max: undefined });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="text-price text-foreground">{formatValue(local[0], def.unit)}</span>
        <span className="text-price text-foreground">{formatValue(local[1], def.unit)}</span>
      </div>

      <RangeSlider
        value={local}
        min={bounds.min}
        max={bounds.max}
        step={10}
        ariaLabel={def.label}
        onValueChange={setLocal}
        onValueCommit={commit}
      />

      {value.min !== undefined || value.max !== undefined ? (
        <button
          type="button"
          onClick={reset}
          className="text-xs font-medium text-primary underline-offset-4 hover:underline"
        >
          {t.catalog.clearFilters}
        </button>
      ) : null}
    </div>
  );
}
