import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import type { Product } from "@/api/types";

type ProductGridProps = {
  products: Product[];
  isLoading?: boolean;
};

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {isLoading
        ? Array.from({ length: 6 }, (_, index) => <ProductCardSkeleton key={`product-skeleton-${index}`} />)
        : products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index === 0}
            />
          ))}
    </div>
  );
}
