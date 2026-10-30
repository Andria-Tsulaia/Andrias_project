import { TriangleAlert } from "lucide-react";

import { t } from "@/content/ka";
import { Button } from "@/shared/ui/button";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

/** ქსელის/სერვერის შეცდომის მდგომარეობა ხელახალი ცდის ღილაკით */
export function ErrorState({ title, description, onRetry, retryLabel, className }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/25 bg-destructive-soft px-6 py-12 text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-card text-destructive">
        <TriangleAlert aria-hidden="true" className="size-6" />
      </span>
      <div className="space-y-1">
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description ?? t.common.networkError}</p>
      </div>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          {retryLabel ?? t.common.retry}
        </Button>
      ) : null}
    </div>
  );
}
