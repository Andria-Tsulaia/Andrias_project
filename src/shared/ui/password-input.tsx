import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { t } from "@/content/ka";
import { Input, type InputProps } from "@/shared/ui/input";
import { cn } from "@/lib/utils";

/** პაროლის ველი ჩვენება/დამალვის ღილაკით — aria-label იცვლება მდგომარეობასთან ერთად */
export const PasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, "type">>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);

    return (
      <div className="relative">
        <Input ref={ref} type={visible ? "text" : "password"} className={cn("pr-11", className)} {...props} />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? t.auth.password.hide : t.auth.password.show}
          aria-pressed={visible}
          className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {visible ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";
