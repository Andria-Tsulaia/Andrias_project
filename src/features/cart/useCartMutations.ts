import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cartApi } from "@/api/cart";
import { CART_QUERY_KEY } from "@/providers/cart/use-cart";

/**
 * რაოდენობის ცვლილება — სტრატეგია: 300ms debounce + ლოკალური optimistic მნიშვნელობა
 * (ADR 0003). ასე სწრაფი დაჭერებიც ერთ მოთხოვნად იგზავნება და ეკრანზე სწორი რიცხვი რჩება.
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, qty }: { itemId: string; qty: number }) => cartApi.updateItem(itemId, qty),
    onSuccess: (cart) => queryClient.setQueryData(CART_QUERY_KEY, cart),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: (cart) => queryClient.setQueryData(CART_QUERY_KEY, cart),
  });
}
