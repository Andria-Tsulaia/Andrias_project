import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

/** ლეიბლი + ველი + შეცდომა/მინიშნება ერთიანად; შეცდომა ველის ქვეშ ჩნდება */
export function FormField({ id, label, error, hint, required, className, children }: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </Label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** aria ატრიბუტები FormField-ის შვილისთვის */
// eslint-disable-next-line react-refresh/only-export-components
export function fieldAriaProps(id: string, error?: string, hint?: string) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
  } as const;
}
