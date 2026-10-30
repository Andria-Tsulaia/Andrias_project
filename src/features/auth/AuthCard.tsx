import type { ReactNode } from "react";

import { t } from "@/content/ka";
import { Logo } from "@/components/layout/Logo";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

/** ავტორიზაციის ეკრანების საერთო ჩარჩო — ერთი და იგივე რიტმი და დაშორებები */
export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="container-page flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo withTagline={false} />
        </div>
        <div className="surface-card p-6 md:p-8">
          <header className="mb-6 space-y-1.5 text-center">
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </header>
          {children}
        </div>
        {footer ? <div className="text-center text-sm text-muted-foreground">{footer}</div> : null}
        <p className="text-center text-xs text-muted-foreground">{t.footer.about}</p>
      </div>
    </div>
  );
}
