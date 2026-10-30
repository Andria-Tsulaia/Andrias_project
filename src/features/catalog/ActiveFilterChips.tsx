import { X } from "lucide-react";

import { t } from "@/content/ka";
import { formatPrice } from "@/lib/format";
import type { CatalogUrlState } from "@/lib/url-params";
import type { FilterDef } from "@/api/types";

type ActiveFilterChipsProps = {
  defs: FilterDef[];
  state: CatalogUrlState;
  onRemoveValue: (key: string, value: string) => void;
  onRemovePrice: () => void;
  onClear: () => void;
};

/** აქტიური ფილტრები — ერთი შეხედვით ჩანს, რა არის არჩეული (URL-ის ანარეკლი) */
export function ActiveFilterChips({
  defs,
  state,
  onRemoveValue,
  onRemovePrice,
  onClear,
}: ActiveFilterChipsProps) {
  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  defs.forEach((def) => {
    if (def.type === "range") return;
    (state.filters[def.key] ?? []).forEach((value) => {
      const label = def.options?.find((option) => option.value === value)?.label ?? value;
      chips.push({ key: `${def.key}:${value}`, label, onRemove: () => onRemoveValue(def.key, value) });
    });
  });

  if (state.price.min !== undefined || state.price.max !== undefined) {
    chips.push({
      key: "price",
      label: `${formatPrice(state.price.min ?? 0)} – ${formatPrice(state.price.max ?? 0)}`,
      onRemove: onRemovePrice,
    });
  }

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">{t.catalog.activeFilters}:</span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-accent"
        >
          {chip.label}
          <X aria-hidden="true" className="size-3.5" />
          <span className="sr-only">{t.catalog.removeFilter}</span>
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="text-xs font-medium text-primary underline-offset-4 hover:underline"
      >
        {t.catalog.clearAll}
      </button>
    </div>
  );
}
