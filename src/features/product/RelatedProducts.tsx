import { t } from "@/content/ka";
import { ProductCard } from "@/features/catalog/ProductCard";
import type { Product } from "@/api/types";

/** მსგავსი პროდუქტები — იგივე ბარათი, რაც კატალოგში (ახალი კომპონენტი არ იწერება) */
export function RelatedProducts({ products }: { products?: Product[] }) {
  if (!products?.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">{t.product.related}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
