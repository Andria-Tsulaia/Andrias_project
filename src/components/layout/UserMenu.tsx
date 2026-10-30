import { Link } from "react-router-dom";
import { LogOut, Package, User } from "lucide-react";

import { t } from "@/content/ka";
import { Button } from "@/shared/ui/button";
import { useAuth } from "@/providers/auth/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export function UserMenu() {
  const { user, status, logout } = useAuth();

  if (status === "loading") {
    return <Skeleton className="size-10 rounded-md" />;
  }

  if (status === "anonymous" || !user) {
    return (
      <div className="flex items-center gap-1.5">
        <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
          <Link to="/login">{t.nav.login}</Link>
        </Button>
        <Button asChild variant="primary" size="sm">
          <Link to="/register">{t.nav.register}</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2" aria-label={t.nav.account}>
          <span className="flex size-7 items-center justify-center rounded-full bg-primary-soft text-primary">
            <User aria-hidden="true" className="size-4" />
          </span>
          <span className="hidden max-w-28 truncate md:inline">{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">
          <span className="block text-sm font-medium text-foreground">{user.name}</span>
          <span className="block truncate text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            <User aria-hidden="true" className="mr-2 size-4" />
            {t.nav.profile}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/orders" className="cursor-pointer">
            <Package aria-hidden="true" className="mr-2 size-4" />
            {t.nav.orders}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={logout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut aria-hidden="true" className="mr-2 size-4" />
          {t.nav.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
