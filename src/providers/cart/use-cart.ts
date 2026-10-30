import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { cartApi } from "@/api/cart";
import type { Cart } from "@/api/types";
import { useAuth } from "@/providers/auth/use-auth";

export const CART_QUERY_KEY = ["cart"] as const;

/** კალათა — ერთი წყარო: ჰედერის ბეჯი, კალათის გვერდი და ჩექაუთი ერთსა და იმავეს კითხულობს */
export function useCart() {
  const { status } = useAuth();

  return useQuery<Cart>({
    queryKey: CART_QUERY_KEY,
    queryFn: ({ signal }) => cartApi.get(signal),
    enabled: status === "authenticated",
    staleTime: 30_000,
  });
}

/** დამატება — ესეც და სხვა მუტაციებიც პასუხს პირდაპირ ქეშში წერენ */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { productId: string; qty: number }) => cartApi.addItem(body),
    onSuccess: (cart) => queryClient.setQueryData(CART_QUERY_KEY, cart),
  });
}
