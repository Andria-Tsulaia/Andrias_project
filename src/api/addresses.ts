import { api } from "./client";
import type { Address } from "./types";

export const addressesApi = {
  list: (signal?: AbortSignal) => api.get<{ items: Address[] }>("/addresses", signal),

  create: (body: {
    label?: string;
    fullName: string;
    phone: string;
    city: string;
    address: string;
    isDefault?: boolean;
  }) => api.post<{ address: Address }>("/addresses", body),

  update: (
    id: string,
    body: Partial<{
      label: string;
      fullName: string;
      phone: string;
      city: string;
      address: string;
      isDefault: boolean;
    }>,
  ) => api.patch<{ address: Address }>(`/addresses/${id}`, body),

  remove: (id: string) => api.delete<void>(`/addresses/${id}`),
};
