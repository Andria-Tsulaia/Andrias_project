import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { t } from "@/content/ka";

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
};

/** გვერდების ნომრები „წინა/შემდეგი“-თ — გვერდების სია იკუმშება ellipsis-ით */
export function Pagination({ page, totalPages, onChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "gap")[] = [];
  for (let current = 1; current <= totalPages; current += 1) {
    const isEdge = current === 1 || current === totalPages;
    const isNear = Math.abs(current - page) <= 1;
    if (isEdge || isNear) pages.push(current);
    else if (pages[pages.length - 1] !== "gap") pages.push("gap");
  }

  const navClass =
    "flex h-10 min-w-10 items-center justify-center rounded-md border border-input bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav className={cn("flex flex-wrap items-center justify-center gap-1.5", className)} aria-label={t.common.pagination}>
      <button
        type="button"
        className={navClass}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label={t.common.previousPage}
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
      </button>

      {pages.map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-sm text-muted-foreground" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              navClass,
              item === page && "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className={navClass}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label={t.common.nextPage}
      >
        <ChevronRight aria-hidden="true" className="size-4" />
      </button>
    </nav>
  );
}
