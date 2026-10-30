import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { ApiError } from "@/api/client";
import { STORE } from "@/config/store";
import { t } from "@/content/ka";
import { Alert } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { Stepper } from "@/shared/ui/stepper";
import { useAuth } from "@/providers/auth/use-auth";
import { useAddToCart } from "@/providers/cart/use-cart";
import type { Product } from "@/api/types";

/** რაოდენობა + კალათაში დამატება — სცენარები FE-005-ის წესებით */
export function AddToCartPanel({ product }: { product: Product }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useAuth();
  const addToCart = useAddToCart();
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const maxQty = Math.max(1, Math.min(product.stock || 1, STORE.maxCartQty));

  useEffect(() => {
    setQty(1);
    setError(null);
  }, [product.id]);

  const handleAdd = async () => {
    setError(null);

    if (status !== "authenticated") {
      navigate("/login", { state: { from: `${location.pathname}${location.search}` } });
      return;
    }

    try {
      await addToCart.mutateAsync({ productId: product.id, qty });
      toast.success(t.product.added, {
        action: { label: t.product.viewCart, onClick: () => navigate("/cart") },
      });
    } catch (mutationError) {
      if (mutationError instanceof ApiError) {
        if (mutationError.code === "OUT_OF_STOCK") setError(t.product.outOfStock);
        else if (mutationError.code === "INSUFFICIENT_STOCK") setError(t.cart.stockWarning(product.stock));
        else if (mutationError.status === 0) setError(t.common.networkError);
        else setError(t.common.somethingWrong);
        return;
      }
      setError(t.common.somethingWrong);
    }
  };

  return (
    <div className="space-y-3">
      {error ? (
        <Alert variant="error" actions={<Link to="/cart" className="text-sm font-medium text-primary underline-offset-4 hover:underline">{t.cart.title}</Link>}>
          {error}
        </Alert>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Stepper value={qty} onChange={setQty} min={1} max={maxQty} disabled={!product.inStock} />
        <Button
          size="lg"
          className="flex-1 min-w-48"
          loading={addToCart.isPending}
          disabled={!product.inStock}
          onClick={() => void handleAdd()}
        >
          <ShoppingCart aria-hidden="true" className="size-4" />
          {product.inStock ? t.product.addToCart : t.product.outOfStock}
        </Button>
      </div>
    </div>
  );
}
