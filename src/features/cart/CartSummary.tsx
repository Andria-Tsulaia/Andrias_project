import { Link } from "react-router-dom";

import { t } from "@/content/ka";
import { formatPrice } from "@/lib/format";
import { Alert } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import type { Cart } from "@/api/types";

type CartSummaryProps = {
  cart: Cart;
  /** რაოდენობა მარაგზე მეტია → ჩექაუთზე გადასვლა ითიშება */
  hasStockIssue: boolean;
};

export function CartSummary({ cart, hasStockIssue }: CartSummaryProps) {
  return (
    <div className="surface-card space-y-4 p-4 md:p-5">
      <h2 className="text-base font-semibold text-foreground">{t.cart.summary}</h2>

      {hasStockIssue ? <Alert variant="warning">{t.cart.stockIssue}</Alert> : null}

      <dl className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">{t.cart.subtotal}</dt>
          <dd className="text-price text-foreground">{formatPrice(cart.subtotal, cart.currency)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2 text-base">
          <dt className="font-semibold text-foreground">{t.cart.total}</dt>
          <dd className="text-price font-semibold text-foreground">
            {formatPrice(cart.subtotal, cart.currency)}
          </dd>
        </div>
      </dl>

      {hasStockIssue ? (
        <Button size="lg" className="w-full" disabled>
          {t.cart.checkout}
        </Button>
      ) : (
        <Button asChild size="lg" className="w-full">
          <Link to="/checkout">{t.cart.checkout}</Link>
        </Button>
      )}

      <Button asChild variant="ghost" className="w-full">
        <Link to="/catalog">{t.cart.continueShopping}</Link>
      </Button>
    </div>
  );
}
