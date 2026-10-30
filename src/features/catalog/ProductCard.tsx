import { Link } from "react-router-dom";
import { ImageOff } from "lucide-react";

import { t } from "@/content/ka";
import { Badge } from "@/shared/ui/badge";
import { PriceTag } from "@/shared/ui/price-tag";
import { RatingStars } from "@/shared/ui/rating-stars";
import { cn } from "@/lib/utils";
import type { Product } from "@/api/types";

type ProductCardProps = {
  product: Product;
  className?: string;
  priority?: boolean;
};

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const lowStock = product.inStock && product.stock > 0 && product.stock <= 5;

  return (
    <article className={cn("surface-card group flex h-full flex-col overflow-hidden", className)}>
      <Link
        to={`/product/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
        aria-label={product.title}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            width={700}
            height={700}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding={priority ? "sync" : "async"}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-muted-foreground">
            <ImageOff aria-hidden="true" className="size-6" />
          </span>
        )}

        {product.discountPercent ? (
          <Badge variant="discount" className="absolute left-2 top-2">
            -{product.discountPercent}%
          </Badge>
        ) : null}

        {!product.inStock ? (
          <span className="absolute inset-x-0 bottom-0 bg-foreground/80 px-2 py-1 text-center text-xs font-medium text-background">
            {t.product.outOfStock}
          </span>
        ) : null}
      </Link>

      <div className="flex min-h-[132px] flex-1 flex-col gap-2 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{product.brand}</p>

        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
          <Link to={`/product/${product.slug}`} className="transition-colors hover:text-primary">
            {product.title}
          </Link>
        </h3>

        <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} />

        <div className="mt-auto space-y-1.5 pt-1">
          <PriceTag
            price={product.price}
            oldPrice={product.oldPrice}
            discountPercent={product.discountPercent}
            currency={product.currency}
            size="md"
          />
          <p className={cn("text-xs", lowStock ? "font-medium text-warning" : "text-muted-foreground")}>
            {product.inStock ? (lowStock ? t.product.lowStock(product.stock) : t.product.inStock) : t.product.outOfStock}
          </p>
        </div>
      </div>
    </article>
  );
}