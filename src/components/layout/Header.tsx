import { lazy, Suspense, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ClipboardList, Sun, Moon } from "lucide-react";

import { t } from "@/content/ka";
import { Logo } from "./Logo";
import { CartButton } from "./CartButton";
import { UserMenu } from "./UserMenu";
const MobileNav = lazy(() => import("./MobileNav").then((module) => ({ default: module.MobileNav })));
import { useAuth } from "@/providers/auth/use-auth";
import { cn } from "@/lib/utils";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-accent text-accent-foreground"
      : "text-foreground hover:bg-accent hover:text-accent-foreground",
  );

export default function Header() {
  const { status } = useAuth();

  const [currentLang, setCurrentLang] = useState<"ka" | "en">(() => {
    return localStorage.getItem("app_language") === "en" ? "en" : "ka";
  });

  const changeLanguage = (nextLang: "ka" | "en") => {
    if (nextLang === currentLang) return;
    localStorage.setItem("app_language", nextLang);
    document.documentElement.lang = nextLang;
    setCurrentLang(nextLang);
    window.location.reload();
  };

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label={t.nav.menu}>
            <NavLink to="/catalog" className={linkClass}>
              {t.nav.catalog}
            </NavLink>
            {status === "authenticated" ? (
              <NavLink to="/orders" className={linkClass}>
                {t.nav.orders}
              </NavLink>
            ) : null}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md border border-border p-1">
            <button
              onClick={() => changeLanguage("ka")}
              className={cn(
                "rounded px-2 py-1 text-sm font-medium transition-colors",
                currentLang === "ka" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={currentLang === "ka"}
              type="button"
            >
              ქართული
            </button>
            <button
              onClick={() => changeLanguage("en")}
              className={cn(
                "rounded px-2 py-1 text-sm font-medium transition-colors",
                currentLang === "en" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={currentLang === "en"}
              type="button"
            >
              English
            </button>
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            className="flex size-10 items-center justify-center rounded-md text-foreground hover:bg-accent"
            aria-label="Toggle Theme"
            type="button"
          >
            {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>

          <Link
            to="/orders"
            aria-label={t.nav.orders}
            className="hidden size-10 items-center justify-center rounded-md text-foreground hover:bg-accent md:flex"
          >
            <ClipboardList aria-hidden="true" className="size-5" />
          </Link>
          <CartButton />
          <UserMenu />
          <Suspense fallback={<span className="md:hidden size-10" aria-hidden="true" />}><MobileNav /></Suspense>
        </div>
      </div>
    </header>
  );
}