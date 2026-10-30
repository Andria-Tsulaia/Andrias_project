import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";

import { ordersApi } from "@/api/orders";
import { t } from "@/content/ka";
import { formatDate, formatPrice } from "@/lib/format";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";
import { SectionCard } from "@/shared/ui/section-card";
import { Skeleton } from "@/components/ui/skeleton";

/** დადასტურების გვერდი — მონაცემები სერვერიდან, ამიტომ F5-ზე არაფერი იკარგება */
const OrderDetailPage = () => {
  // Router-ში პარამეტრი :id-ად არის გამოცხადებული; აქაც იგივე სახელი უნდა წავიკითხოთ.
  const { id: orderId = "" } = useParams<{ id: string }>();

  const orderQuery = useQuery({
    queryKey: ["order", orderId],
    queryFn: ({ signal }) => ordersApi.get(orderId, signal).then((response) => response.order),
    enabled: Boolean(orderId),
  });

  const order = orderQuery.data;

  if (orderQuery.isLoading) {
    return (
      <div className="container-page space-y-4 py-6">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    );
  }

  if (orderQuery.isError || !order) {
    return (
      <div className="container-page py-6">
        <EmptyState
          title={t.order.error.title}
          action={
            <Button asChild>
              <Link to="/orders">{t.nav.orders}</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page space-y-6 py-6">
      <div className="surface-card flex flex-wrap items-center gap-4 p-5">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-success-soft text-success motion-safe:animate-in motion-safe:zoom-in-50">
          <CheckCircle2 aria-hidden="true" className="size-6" />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <h1 className="text-xl font-semibold text-foreground">{order.status === "paid" ? t.order.successTitle : t.order.detailsTitle}</h1>
          {order.status === "paid" ? (
            <p className="text-sm text-muted-foreground">{t.order.successDescription}</p>
          ) : null}
          <p className="text-sm font-medium text-foreground">{t.order.number(order.id)}</p>
        </div>
        <Badge variant={order.status === "paid" ? "success" : "warning"} className="ml-auto">
          {t.order.statuses[order.status] ?? order.status}
        </Badge>
      </div>

      {order.status === "paid" ? (
        <section className="surface-card space-y-3 border border-success/20 p-5 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2" aria-live="polite">
          <p className="text-sm font-semibold text-success">{t.order.orderReceived}</p>
          <p className="text-lg font-semibold text-foreground">{t.order.thankYou}</p>
          <div className="mx-auto max-w-sm rounded-lg bg-success-soft px-4 py-3">
            <p className="text-xs text-muted-foreground">{t.order.total}</p>
            <p className="text-2xl font-bold text-foreground">{formatPrice(order.total, order.currency)}</p>
          </div>
          <p className="text-xs text-muted-foreground">{t.order.paymentDemo}</p>
        </section>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <SectionCard title={t.order.items} bodyClassName="space-y-3">
          <ul className="space-y-3">
            {order.items.map((item) => (
              <li key={`${item.productId}-${item.slug}`} className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.title}
                  width={64}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  className="size-16 rounded-md border border-border object-cover"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/product/${item.slug}`}
                    className="line-clamp-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {item.qty} × {formatPrice(item.price, order.currency)}
                  </p>
                </div>
                <span className="text-price text-sm text-foreground">
                  {formatPrice(item.lineTotal, order.currency)}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title={t.order.total}>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t.order.subtotal}</dt>
                <dd className="text-price text-foreground">{formatPrice(order.subtotal, order.currency)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t.order.shippingFee}</dt>
                <dd className="text-price text-foreground">
                  {order.shippingFee === 0 ? t.order.shippingFree : formatPrice(order.shippingFee, order.currency)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base">
                <dt className="font-semibold text-foreground">{t.order.total}</dt>
                <dd className="text-price font-semibold text-foreground">
                  {formatPrice(order.total, order.currency)}
                </dd>
              </div>
            </dl>
          </SectionCard>

          <SectionCard title={t.order.shipping} bodyClassName="space-y-1 text-sm">
            <p className="text-foreground">{order.shipping.fullName}</p>
            <p className="text-muted-foreground">{order.shipping.phone}</p>
            <p className="text-muted-foreground">
              {order.shipping.city}, {order.shipping.address}
            </p>
          </SectionCard>

          <SectionCard title={t.order.payment} bodyClassName="space-y-1 text-sm">
            {order.payment ? (
              <p className="text-foreground">
                {order.payment.brand.toUpperCase()} •••• {order.payment.last4}
              </p>
            ) : null}
            <p className="text-muted-foreground">
              {t.order.createdAt}: {formatDate(order.createdAt)}
            </p>
            {order.paidAt ? (
              <p className="text-muted-foreground">
                {t.order.paidAt}: {formatDate(order.paidAt)}
              </p>
            ) : null}
          </SectionCard>

          <Button asChild variant="outline" className="w-full">
            <Link to="/catalog">{t.order.backToCatalog}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
