import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

import { ApiError } from "@/api/client";
import { STORE } from "@/config/store";
import { t } from "@/content/ka";
import { formatPrice } from "@/lib/format";
import { Alert } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { Stepper } from "@/shared/ui/stepper";
import { useRemoveCartItem, useUpdateCartItem } from "./useCartMutations";
import type { CartItem } from "@/api/types";

const DEBOUNCE_MS = 300;

/** კალათის პოზიცია — PATCH/DELETE მიდის პოზიციის id-ით (items[].id), არა productId-ით */
export function CartItemRow({ item }: { item: CartItem }) {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const [localQty, setLocalQty] = useState(item.qty);
  const [error, setError] = useState<string | null>(null);
  const pendingRef = useRef(false);
  const timerRef = useRef<number | undefined>(undefined);

  const maxQty = Math.max(1, Math.min(item.product.stock || 1, STORE.maxCartQty));
  const overStock = item.product.inStock && item.qty > item.product.stock;

  // სერვერის ჭეშმარიტი მნიშვნელობა — მხოლოდ მაშინ, როცა ლოკალური ცვლილება არ მიმდინარეობს
  useEffect(() => {
    if (!pendingRef.current) setLocalQty(item.qty);
  }, [item.qty]);

  const changeQty = (next: number) => {
    setLocalQty(next);
    setError(null);
    pendingRef.current = true;

    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(async () => {
      try {
        await updateItem.mutateAsync({ itemId: item.id, qty: next });
      } catch (mutationError) {
        setLocalQty(item.qty);
        if (mutationError instanceof ApiError && mutationError.code === "INSUFFICIENT_STOCK") {
          setError(t.cart.stockWarning(item.product.stock));
        } else if (mutationError instanceof ApiError && mutationError.status === 0) {
          setError(t.common.networkError);
        } else {
          setError(t.common.somethingWrong);
        }
      } finally {
        pendingRef.current = false;
      }
    }, DEBOUNCE_MS);
  };

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return (
    <li className="flex flex-col gap-3 border-b border-border py-4 last:border-b-0 sm:flex-row sm:items-center">
      <Link to={`/product/${item.product.slug}`} className="shrink-0">
        <img
          src={item.product.image}
          alt={item.product.title}
          width={80}
          height={80}
          loading="lazy"
          decoding="async"
          className="size-20 rounded-md border border-border bg-muted object-cover"
        />
      </Link>

      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {item.product.brand}
        </p>
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
          <Link to={`/product/${item.product.slug}`} className="transition-colors hover:text-primary">
            {item.product.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">
          {formatPrice(item.product.price, item.product.currency)}
        </p>
        {!item.product.inStock ? (
          <p className="text-xs font-medium text-destructive">{t.product.outOfStock}</p>
        ) : overStock ? (
          <p className="text-xs font-medium text-warning">{t.cart.stockWarning(item.product.stock)}</p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <Stepper
          value={localQty}
          onChange={changeQty}
          min={1}
          max={maxQty}
          size="sm"
          disabled={!item.product.inStock}
        />
        <div className="flex items-center gap-3">
          <span className="text-price text-sm text-foreground">
            {formatPrice(item.lineTotal, item.product.currency)}
          </span>
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="icon" aria-label={t.cart.remove}>
                <Trash2 aria-hidden="true" className="size-4 text-destructive" />
              </Button>
            }
            title={t.cart.removeConfirmTitle(item.product.title)}
            description={t.cart.removeConfirmText}
            confirmLabel={t.cart.remove}
            onConfirm={() => removeItem.mutate(item.id)}
          />
        </div>
      </div>

      {error ? (
        <Alert variant="error" className="w-full sm:order-last">
          {error}
        </Alert>
      ) : null}
    </li>
  );
}
