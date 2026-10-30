import { Navigate } from "react-router-dom";

import { t } from "@/content/ka";
import { ErrorState } from "@/shared/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckoutForm } from "@/features/checkout/CheckoutForm";
import { OrderSummary } from "@/features/checkout/OrderSummary";
import { useCheckout } from "@/features/checkout/useCheckout";

const CheckoutPage = () => {
  const checkoutQuery = useCheckout();
  const checkout = checkoutQuery.data;

  if (checkoutQuery.isLoading) {
    return (
      <div className="container-page grid gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-72 w-full rounded-lg" />
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    );
  }

  if (checkoutQuery.isError || !checkout) {
    return (
      <div className="container-page py-6">
        <ErrorState
          title={t.checkout.title}
          onRetry={() => void checkoutQuery.refetch()}
          retryLabel={t.common.retry}
        />
      </div>
    );
  }

  // ცარიელი კალათით ჩექაუთი მიუწვდომელია
  if (checkout.items.length === 0) return <Navigate to="/cart" replace />;

  return (
    <div className="container-page space-y-6 py-6">
      <h1 className="text-2xl font-semibold text-foreground md:text-3xl">{t.checkout.title}</h1>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <CheckoutForm checkout={checkout} />

        <div className="lg:sticky lg:top-20 lg:h-fit">
          <OrderSummary
            items={checkout.items}
            subtotal={checkout.subtotal}
            shippingFee={checkout.shippingFee}
            total={checkout.total}
            currency={checkout.currency}
            freeShippingFrom={checkout.freeShippingFrom}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
