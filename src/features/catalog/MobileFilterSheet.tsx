import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { t } from "@/content/ka";
import { Button } from "@/shared/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FilterPanel } from "./FilterPanel";
import type { CatalogUrlState } from "@/lib/url-params";
import type { FilterDef } from "@/api/types";

type MobileFilterSheetProps = {
  defs: FilterDef[];
  state: CatalogUrlState;
  isLoading: boolean;
  isError: boolean;
  activeCount: number;
  onValueChange: (key: string, values: string[]) => void;
  onPriceChange: (range: { min?: number; max?: number }) => void;
  onClear: () => void;
};

/** მობილურზე ფილტრები ფურცელში იხსნება — 360px-ზე პანელი კონტენტს არ ავიწროებს */
export function MobileFilterSheet({
  defs,
  state,
  isLoading,
  isError,
  activeCount,
  onValueChange,
  onPriceChange,
  onClear,
}: MobileFilterSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden">
          <SlidersHorizontal aria-hidden="true" className="size-4" />
          {t.catalog.filters}
          {activeCount > 0 ? (
            <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs text-accent-foreground">
              {activeCount}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] overflow-y-auto p-0 sm:w-80">
        <SheetHeader>
          <SheetTitle>{t.catalog.filters}</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-6">
          <FilterPanel
            defs={defs}
            state={state}
            isLoading={isLoading}
            isError={isError}
            onValueChange={onValueChange}
            onPriceChange={onPriceChange}
            onClear={onClear}
            activeCount={activeCount}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
