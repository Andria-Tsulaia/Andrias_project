import type { ReactNode } from "react";
import { PackageSearch } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  hint?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export function EmptyState({ title, hint, action, icon, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon ?? <PackageSearch aria-hidden="true" className="size-6" />}
      </span>
      <div className="space-y-1">
        <p className="text-base font-semibold text-foreground">{title}</p>
        {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      </div>
      {action}
    </div>
  );
}
