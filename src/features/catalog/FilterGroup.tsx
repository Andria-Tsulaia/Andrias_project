import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { FilterDef } from "@/api/types";
import { RangeFilter } from "./RangeFilter";

/** ფერის slug → ვიზუალური ნიმუში (მხოლოდ ჩვენება; ფილტრის მნიშვნელობა სერვერიდან მოდის) */
const COLOR_SWATCH: Record<string, string> = {
  white: "#ffffff",
  black: "#16181d",
  grey: "#9aa1ac",
  gray: "#9aa1ac",
  brown: "#8b5e34",
  blue: "#2b4cf2",
  natural: "#e6d8c3",
  silver: "#c9ced6",
  gold: "#d4af37",
  red: "#d92d20",
  green: "#12805c",
};

type FilterGroupProps = {
  def: FilterDef;
  selected: string[];
  price: { min?: number; max?: number };
  onChange: (key: string, values: string[]) => void;
  onPriceChange: (range: { min?: number; max?: number }) => void;
};

/** ფილტრის ჯგუფი — ტიპი განსაზღვრავს, რა დავხატოთ (checkbox / radio / color / range) */
export function FilterGroup({ def, selected, price, onChange, onPriceChange }: FilterGroupProps) {
  if (def.type === "range") {
    return (
      <fieldset className="space-y-3 border-t border-border pt-4">
        <legend className="pb-2 text-sm font-semibold text-foreground">{def.label}</legend>
        <RangeFilter def={def} value={price} onCommit={onPriceChange} />
      </fieldset>
    );
  }

  const options = def.options ?? [];
  const isRadio = def.type === "radio";

  return (
    <fieldset className="space-y-2 border-t border-border pt-4">
      <legend className="pb-1 text-sm font-semibold text-foreground">{def.label}</legend>

      {def.type === "color" ? (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const active = selected.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                title={option.label}
                onClick={() => onChange(def.key, active ? [] : [option.value])}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs transition-colors",
                  active
                    ? "border-primary bg-primary-soft text-accent-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-accent",
                )}
              >
                <span
                  className="size-4 rounded-full border border-border"
                  style={{ backgroundColor: COLOR_SWATCH[option.value] ?? "transparent" }}
                  aria-hidden="true"
                />
                {option.label}
                {active ? <Check aria-hidden="true" className="size-3.5" /> : null}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {options.map((option) => {
            const active = selected.includes(option.value);
            return (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground"
              >
                <input
                  type={isRadio ? "radio" : "checkbox"}
                  name={def.key}
                  value={option.value}
                  checked={active}
                  onChange={() =>
                    onChange(def.key, isRadio ? [option.value] : active ? selected.filter((v) => v !== option.value) : [...selected, option.value])
                  }
                  className="size-4 shrink-0 cursor-pointer accent-primary"
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}
