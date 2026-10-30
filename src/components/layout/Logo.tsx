import { Link } from "react-router-dom";
import { Laptop } from "lucide-react";

import { STORE } from "@/config/store";
import { t } from "@/content/ka";
import { cn } from "@/lib/utils";

/** ბრენდი — ჰედერსა და ფუთერში ერთი კომპონენტი */
export function Logo({ className, withTagline = true }: { className?: string; withTagline?: boolean }) {
  return (
    <Link to="/catalog" className={cn("flex items-center gap-2.5 rounded-md", className)}>
      <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Laptop aria-hidden="true" className="size-5" />
      </span>
      <span className="leading-tight">
        <span className="block text-lg font-semibold text-foreground">{STORE.brandName}</span>
        {withTagline ? (
          <span className="hidden text-xs text-muted-foreground sm:block">{t.app.tagline}</span>
        ) : null}
      </span>
    </Link>
  );
}
