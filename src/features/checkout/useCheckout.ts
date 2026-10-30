import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { checkoutApi, ordersApi } from "@/api/orders";
import { CART_QUERY_KEY } from "@/providers/cart/use-cart";
import type { Cart } from "@/api/types";

export const CHECKOUT_QUERY_KEY = ["checkout"] as const;

export function useCheckout() {
  return useQuery({
    queryKey: CHECKOUT_QUERY_KEY,
    queryFn: ({ signal }) => checkoutApi.get(signal),
  });
}

/** შეკვეთის შექმნა — ბარათის მონაცემები არსად ინახება, მხოლოდ მოთხოვნის body-შია */
export function useCreateOrder() {
  return useMutation({ mutationFn: ordersApi.create });
}

/** კოდის დადასტურება — წარმატებაზე კალათა ფრონტზეც ცარიელდება (ბეჯი → 0) */
export function useConfirmOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, code }: { orderId: string; code: string }) => ordersApi.confirm(orderId, code),
    onSuccess: () => {
      queryClient.setQueryData<Cart>(CART_QUERY_KEY, {
        items: [],
        totalQty: 0,
        subtotal: 0,
        currency: "GEL",
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: CHECKOUT_QUERY_KEY });
    },
  });
}

export function useResendOrderCode() {
  return useMutation({ mutationFn: (orderId: string) => ordersApi.resendCode(orderId) });
}
