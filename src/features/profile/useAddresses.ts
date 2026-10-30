import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { addressesApi } from "@/api/addresses";
import type { AddressValues } from "@/lib/validation";

export const ADDRESSES_QUERY_KEY = ["addresses"] as const;

export function useAddresses() {
  return useQuery({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: ({ signal }) => addressesApi.list(signal).then((response) => response.items),
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    // პასუხში მხოლოდ ერთი მისამართი მოდის — სია თავიდან ჩამოიტვირთება
    mutationFn: (values: AddressValues) => addressesApi.create(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<AddressValues> }) =>
      addressesApi.update(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY }),
  });
}

export function useRemoveAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addressesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY }),
  });
}
