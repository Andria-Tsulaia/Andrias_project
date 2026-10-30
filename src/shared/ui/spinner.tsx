import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type SpinnerProps = React.HTMLAttributes<HTMLSpanElement> & {
  label?: string;
};

/** ლოადერი — ტექსტი ეკრანის წამკითხველისთვის, ვიზუალი ხატულა */
export function Spinner({ className, label, ...props }: SpinnerProps) {
  return (
    <span role="status" className={cn("inline-flex items-center gap-2", className)} {...props}>
      <Loader2 aria-hidden="true" className="size-4 animate-spin" />
      {label ? <span className="text-sm text-muted-foreground">{label}</span> : null}
    </span>
  );
}
