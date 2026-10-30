import { Badge } from "@/shared/ui/badge";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Currency } from "@/api/types";

type PriceTagProps = {
  price: number;
  oldPrice?: number | null;
  discountPercent?: number | null;
  currency?: Currency;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE_CLASS = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
} as const;

/** ფასი + გადახაზული ძველი ფასი + ფასდაკლების ბეჯი */
export function PriceTag({
  price,
  oldPrice,
  discountPercent,
  currency = "GEL",
  size = "md",
  className,
}: PriceTagProps) {
  const hasDiscount = typeof oldPrice === "number" && oldPrice > price;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className={cn("text-price text-foreground", SIZE_CLASS[size])}>{formatPrice(price, currency)}</span>
      {hasDiscount ? (
        <>
          <span className="text-sm text-muted-foreground line-through">{formatPrice(oldPrice, currency)}</span>
          {typeof discountPercent === "number" && discountPercent > 0 ? (
            <Badge variant="discount">-{discountPercent}%</Badge>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
