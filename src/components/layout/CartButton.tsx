import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

import { t } from "@/content/ka";
import { useCart } from "@/providers/cart/use-cart";
import { useAuth } from "@/providers/auth/use-auth";

/** კალათის ღილაკი რაოდენობის ბეჯით — ბეჯი კალათის ერთი წყაროდან მოდის */
export function CartButton() {
  const { status } = useAuth();
  const { data } = useCart();
  const count = status === "authenticated" ? data?.totalQty ?? 0 : 0;

  return (
    <Link
      to="/cart"
      aria-label={`${t.nav.cart}${count > 0 ? ` — ${count}` : ""}`}
      className="relative flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <ShoppingCart aria-hidden="true" className="size-5" />
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold leading-5 text-primary-foreground">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
