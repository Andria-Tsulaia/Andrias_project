import { lazy, Suspense, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ShieldCheck } from "lucide-react";

import { catalogApi } from "@/api/catalog";
import { ApiError } from "@/api/client";
import { STORE } from "@/config/store";
import { t } from "@/content/ka";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";
import { PriceTag } from "@/shared/ui/price-tag";
import { RatingStars } from "@/shared/ui/rating-stars";
import { AddToCartPanel } from "@/features/product/AddToCartPanel";
import { Gallery } from "@/features/product/Gallery";
import { ProductSkeleton } from "@/features/product/ProductSkeleton";
const RelatedProducts = lazy(() => import("@/features/product/RelatedProducts").then((module) => ({ default: module.RelatedProducts })));
const SpecsTable = lazy(() => import("@/features/product/SpecsTable").then((module) => ({ default: module.SpecsTable })));

/** key={slug} — პროდუქტის შეცვლისას მდგომარეობა (გალერეა, რაოდენობა) ნულდება */
const ProductView = ({ slug }: { slug: string }) => {
  const productQuery = useQuery({
    queryKey: ["product", slug],
    queryFn: ({ signal }) => catalogApi.product(slug, signal),
  });

  const product = productQuery.data;

  useEffect(() => {
    if (!product) return;
    const previous = document.title;
    document.title = `${product.title} — ${STORE.brandName}`;
    return () => {
      document.title = previous;
    };
  }, [product]);

  if (productQuery.isLoading) return <ProductSkeleton />;

  const notFound = productQuery.error instanceof ApiError && productQuery.error.status === 404;

  if (notFound) {
    return (
      <EmptyState
        title={t.product.notFound.title}
        hint={t.product.notFound.hint}
        action={
          <Button asChild>
            <Link to="/catalog">{t.product.notFound.action}</Link>
          </Button>
        }
      />
    );
  }

  if (productQuery.isError || !product) {
    return (
      <ErrorState
        title={t.product.error.title}
        onRetry={() => void productQuery.refetch()}
        retryLabel={t.product.error.retry}
      />
    );
  }

  const lowStock = product.inStock && product.stock > 0 && product.stock <= 5;

  return (
    <div className="space-y-10">
      <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/catalog" className="transition-colors hover:text-foreground">
          {t.product.breadcrumbHome}
        </Link>
        <ChevronRight aria-hidden="true" className="size-3.5" />
        <Link to="/catalog" className="transition-colors hover:text-foreground">
          {product.category?.name ?? t.catalog.title}
        </Link>
        <ChevronRight aria-hidden="true" className="size-3.5" />
        <span className="truncate text-foreground">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <Gallery title={product.title} image={product.image} images={product.images} />

        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{product.brand}</p>
            <h1 className="text-2xl font-semibold text-foreground md:text-3xl">{product.title}</h1>
            <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <PriceTag
              price={product.price}
              oldPrice={product.oldPrice}
              discountPercent={product.discountPercent}
              currency={product.currency}
              size="lg"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {product.inStock ? (
              lowStock ? (
                <Badge variant="warning">{t.product.lowStock(product.stock)}</Badge>
              ) : (
                <Badge variant="success">{t.product.inStock}</Badge>
              )
            ) : (
              <Badge variant="destructive">{t.product.outOfStock}</Badge>
            )}

            {product.warrantyMonths > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <ShieldCheck aria-hidden="true" className="size-4" />
                {t.product.warranty(product.warrantyMonths)}
              </span>
            ) : null}
          </div>

          <AddToCartPanel product={product} />

          {product.description ? (
            <div className="space-y-2 border-t border-border pt-5">
              <h2 className="text-base font-semibold text-foreground">{t.product.description}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            </div>
          ) : null}
        </div>
      </div>

      <Suspense fallback={null}>
        {product.specs ? <SpecsTable specs={product.specs} /> : null}
        <RelatedProducts products={product.related} />
      </Suspense>
    </div>
  );
};

const ProductPage = () => {
  const { slug = "" } = useParams();

  return (
    <div className="container-page py-6">
      <ProductView key={slug} slug={slug} />
    </div>
  );
};

export default ProductPage;
