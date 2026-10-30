import { api } from "./client";
import type { Cart } from "./types";

export const cartApi = {
  get: (signal?: AbortSignal) => api.get<Cart>("/cart", signal),

  /** productId — პროდუქტის id; PATCH/DELETE კი კალათის პოზიციის (items[].id) id-ს იყენებს */
  addItem: (body: { productId: string; qty: number }) => api.post<Cart>("/cart/items", body),

  updateItem: (itemId: string, qty: number) =>
    api.patch<Cart>(`/cart/items/${itemId}`, { qty }),

  removeItem: (itemId: string) => api.delete<Cart>(`/cart/items/${itemId}`),
};
