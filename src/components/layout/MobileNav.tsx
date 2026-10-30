import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";

import { t } from "@/content/ka";
import { Button } from "@/shared/ui/button";
import { useAuth } from "@/providers/auth/use-auth";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const items = [
  { to: "/catalog", label: t.nav.catalog },
  { to: "/cart", label: t.nav.cart },
  { to: "/orders", label: t.nav.orders, authOnly: true },
  { to: "/profile", label: t.nav.profile, authOnly: true },
  { to: "/login", label: t.nav.login, guestOnly: true },
  { to: "/register", label: t.nav.register, guestOnly: true },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { status } = useAuth();

  const visibleItems = items.filter((item) => {
    if (item.authOnly) return status === "authenticated";
    if (item.guestOnly) return status === "anonymous";
    return true;
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label={t.nav.openMenu}>
          <Menu aria-hidden="true" className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle>{t.nav.menu}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4 pb-6" aria-label={t.nav.menu}>
          {visibleItems.map((item) => (
            <SheetClose asChild key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
