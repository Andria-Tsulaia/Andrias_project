import { api } from "./client";
import type { Checkout, Order, PaymentCard, ShippingDetails } from "./types";

export const checkoutApi = {
  get: (signal?: AbortSignal) => api.get<Checkout>("/checkout", signal),
};

export const ordersApi = {
  create: (body: { shipping: ShippingDetails; card: PaymentCard }) =>
    api.post<{
      orderId: string;
      status: string;
      total: number;
      currency: string;
      message?: string;
      expiresInMinutes?: number;
      devCode?: string;
    }>("/orders", body),

  confirm: (orderId: string, code: string) =>
    api.post<{ order: Order }>(`/orders/${orderId}/confirm`, { code }),

  resendCode: (orderId: string) =>
    api.post<{ message?: string; retryAfterSeconds?: number }>(`/orders/${orderId}/resend-code`),

  list: (signal?: AbortSignal) => api.get<{ items: Order[] }>("/orders", signal),

  get: (orderId: string, signal?: AbortSignal) =>
    api.get<{ order: Order }>(`/orders/${orderId}`, signal),
};
