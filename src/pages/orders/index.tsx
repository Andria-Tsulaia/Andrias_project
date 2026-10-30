import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList } from "lucide-react";

import { ordersApi } from "@/api/orders";
import { t } from "@/content/ka";
import { formatDate, formatPrice } from "@/lib/format";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";

const statusVariant = (status: string) =>
  status === "paid" ? "success" : status === "cancelled" ? "destructive" : "warning";

const OrdersPage = () => {
  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: ({ signal }) => ordersApi.list(signal).then((response) => response.items),
  });

  const orders = ordersQuery.data ?? [];

  return (
    <div className="container-page space-y-5 py-6">
      <h1 className="text-2xl font-semibold text-foreground md:text-3xl">{t.orders.title}</h1>

      {ordersQuery.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : ordersQuery.isError ? (
        <ErrorState
          title={t.orders.error.title}
          onRetry={() => void ordersQuery.refetch()}
          retryLabel={t.orders.error.retry}
        />
      ) : orders.length === 0 ? (
        <EmptyState
          title={t.orders.empty}
          icon={<ClipboardList aria-hidden="true" className="size-6" />}
          action={
            <Button asChild>
              <Link to="/catalog">{t.order.backToCatalog}</Link>
            </Button>
          }
        />
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id} className="surface-card flex flex-wrap items-center justify-between gap-4 p-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">{t.order.number(order.id)}</p>
                <p className="text-xs text-muted-foreground">
                  {t.orders.date}: {formatDate(order.createdAt)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Badge variant={statusVariant(order.status)}>
                  {t.order.statuses[order.status] ?? order.status}
                </Badge>
                <span className="text-price text-sm text-foreground">{formatPrice(order.total, order.currency)}</span>
                <Button asChild variant="outline" size="sm">
                  <Link to={`/orders/${order.id}`}>{t.orders.open}</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;
