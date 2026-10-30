import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionCardProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

/** სექციის ბარათი — სათაური + აღწერა + მოქმედება ერთ სტილში მთელ აპში */
export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: SectionCardProps) {
  return (
    <section className={cn("surface-card overflow-hidden", className)}>
      {title ? (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 md:px-6">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {action}
        </header>
      ) : null}
      <div className={cn("px-4 py-4 md:px-6", bodyClassName)}>{children}</div>
    </section>
  );
}
