import { SlidersHorizontal, X } from "lucide-react";

import { t } from "@/content/ka";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterGroup } from "./FilterGroup";
import type { FilterDef } from "@/api/types";
import type { CatalogUrlState } from "@/lib/url-params";

type FilterPanelProps = {
  defs: FilterDef[];
  state: CatalogUrlState;
  isLoading: boolean;
  isError: boolean;
  onValueChange: (key: string, values: string[]) => void;
  onPriceChange: (range: { min?: number; max?: number }) => void;
  onClear: () => void;
  activeCount: number;
};

/** ფილტრების პანელი — ჯგუფები მხოლოდ სერვერის `filters` მასივიდან იხატება */
export function FilterPanel({
  defs,
  state,
  isLoading,
  isError,
  onValueChange,
  onPriceChange,
  onClear,
  activeCount,
}: FilterPanelProps) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center justify-between gap-2 pb-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <SlidersHorizontal aria-hidden="true" className="size-4" />
          {t.catalog.filters}
          {activeCount > 0 ? (
            <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs text-accent-foreground">
              {activeCount}
            </span>
          ) : null}
        </p>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={onClear}
            aria-label={t.catalog.clearAll}
            title={t.catalog.clearAll}
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        ) : null}
      </div>

      {isLoading ? (
        <div className="space-y-4 pt-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2 border-t border-border pt-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <p className="border-t border-border pt-4 text-sm text-muted-foreground">{t.common.networkError}</p>
      ) : defs.length === 0 ? null : (
        <div className="space-y-4">
          {defs.map((def) => (
            <FilterGroup
              key={def.key}
              def={def}
              selected={state.filters[def.key] ?? []}
              price={state.price}
              onChange={onValueChange}
              onPriceChange={onPriceChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
