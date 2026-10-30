import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  /** შეცდომის მდგომარეობა — წითელი ჩარჩო + ring */
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", invalid = false, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        "flex h-11 w-full rounded-md border bg-card px-3 py-2 text-sm text-foreground transition-colors",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70",
        invalid ? "border-destructive focus-visible:ring-destructive" : "border-input",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
