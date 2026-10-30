import { Link } from "react-router-dom";

import { t } from "@/content/ka";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { CartItemRow } from "@/features/cart/CartItemRow";
import { CartSummary } from "@/features/cart/CartSummary";
import { useCart } from "@/providers/cart/use-cart";

const CartSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="flex gap-4 border-b border-border pb-4">
        <Skeleton className="size-20 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    ))}
  </div>
);

const CartPage = () => {
  const cartQuery = useCart();
  const cart = cartQuery.data;

  const hasStockIssue = Boolean(
    cart?.items.some((item) => item.product.inStock && item.qty > item.product.stock),
  );

  return (
    <div className="container-page py-6">
      <h1 className="text-2xl font-semibold text-foreground md:text-3xl">{t.cart.title}</h1>

      <div className="mt-5">
        {cartQuery.isLoading ? (
          <CartSkeleton />
        ) : cartQuery.isError ? (
          <ErrorState
            title={t.cart.error.title}
            onRetry={() => void cartQuery.refetch()}
            retryLabel={t.cart.error.retry}
          />
        ) : !cart || cart.items.length === 0 ? (
          <EmptyState
            title={t.cart.empty.title}
            hint={t.cart.empty.hint}
            action={
              <Button asChild>
                <Link to="/catalog">{t.cart.empty.action}</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <section className="surface-card px-4 py-2 md:px-5">
              <ul>
                {cart.items.map((item) => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </ul>
            </section>

            <div className="lg:sticky lg:top-20 lg:h-fit">
              <CartSummary cart={cart} hasStockIssue={hasStockIssue} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
