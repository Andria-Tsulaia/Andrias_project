import { t } from "@/content/ka";
import { formatPrice } from "@/lib/format";
import { Alert } from "@/shared/ui/alert";
import { SectionCard } from "@/shared/ui/section-card";
import type { CartItem, Currency } from "@/api/types";

type OrderSummaryProps = {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  currency: Currency;
  freeShippingFrom: number;
};

/** ჩექაუთის შეჯამება — ჯამებს ვითვლით არა, სერვერიდან ვიღებთ */
export function OrderSummary({
  items,
  subtotal,
  shippingFee,
  total,
  currency,
  freeShippingFrom,
}: OrderSummaryProps) {
  const missingForFreeShipping = Math.max(0, freeShippingFrom - subtotal);

  return (
    <SectionCard title={t.checkout.summarySection} bodyClassName="space-y-4">
      {missingForFreeShipping > 0 ? (
        <Alert variant="info">{t.checkout.freeShippingHint(formatPrice(missingForFreeShipping, currency))}</Alert>
      ) : null}

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <img
              src={item.product.image}
              alt={item.product.title}
              width={48}
              height={48}
              loading="lazy"
              decoding="async"
              className="size-12 rounded-md border border-border object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm text-foreground">{item.product.title}</p>
              <p className="text-xs text-muted-foreground">{item.qty} ×</p>
            </div>
            <span className="text-price text-sm text-foreground">
              {formatPrice(item.lineTotal, currency)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="space-y-2 border-t border-border pt-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t.cart.subtotal}</dt>
          <dd className="text-price text-foreground">{formatPrice(subtotal, currency)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t.cart.shipping}</dt>
          <dd className="text-price text-foreground">
            {shippingFee === 0 ? t.cart.shippingFree : formatPrice(shippingFee, currency)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-border pt-2 text-base">
          <dt className="font-semibold text-foreground">{t.cart.total}</dt>
          <dd className="text-price font-semibold text-foreground">{formatPrice(total, currency)}</dd>
        </div>
      </dl>
    </SectionCard>
  );
}
