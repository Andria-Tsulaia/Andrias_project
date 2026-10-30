import { AlertCircle, AlertTriangle, CheckCircle2, Info, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type AlertVariant = "info" | "success" | "warning" | "error";

const VARIANTS: Record<AlertVariant, { icon: LucideIcon; className: string }> = {
  info: { icon: Info, className: "border-primary/25 bg-primary-soft text-foreground" },
  success: { icon: CheckCircle2, className: "border-success/25 bg-success-soft text-foreground" },
  warning: { icon: AlertTriangle, className: "border-warning/30 bg-warning-soft text-foreground" },
  error: { icon: AlertCircle, className: "border-destructive/30 bg-destructive-soft text-foreground" },
};

type AlertProps = {
  variant?: AlertVariant;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
};

export function Alert({ variant = "info", title, children, className, actions }: AlertProps) {
  const { icon: Icon, className: variantClass } = VARIANTS[variant];

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-lg border p-3 text-sm", variantClass, className)}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <div className="space-y-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className="text-muted-foreground">{children}</div> : null}
        {actions ? <div className="pt-1">{actions}</div> : null}
      </div>
    </div>
  );
}
