import { Link } from "react-router-dom";

import { STORE } from "@/config/store";
import { t } from "@/content/ka";
import { Logo } from "./Logo";

const columns = [
  {
    title: t.footer.sections.shop,
    links: [
      { to: "/catalog", label: t.nav.catalog },
      { to: "/cart", label: t.nav.cart },
    ],
  },
  {
    title: t.footer.sections.account,
    links: [
      { to: "/login", label: t.nav.login },
      { to: "/register", label: t.nav.register },
      { to: "/profile", label: t.nav.profile },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-10 border-t border-border bg-card">
      <div className="container-page grid gap-8 py-10 md:grid-cols-4">
        <div className="space-y-3 md:col-span-2">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">{t.footer.about}</p>
        </div>

        {columns.map((column) => (
          <div key={column.title} className="space-y-3">
            <p className="text-sm font-semibold text-foreground">{column.title}</p>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} {STORE.brandName}. {t.footer.rights}
          </p>
          <p>{t.footer.owner}</p>
        </div>
      </div>
    </footer>
  );
}
