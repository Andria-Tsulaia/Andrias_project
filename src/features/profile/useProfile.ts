import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authApi } from "@/api/auth";
import { useAuth } from "@/providers/auth/use-auth";
import type { User } from "@/api/types";

export const ME_QUERY_KEY = ["me"] as const;

export function useMe() {
  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: ({ signal }) => authApi.me(signal).then((response) => response.user),
  });
}

/** წარმატებაზე ახალი მომხმარებელი იწერება გლობალურ მდგომარეობაშიც (ჰედერი მაშინვე ახლდება) */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: authApi.updateMe,
    onSuccess: ({ user }) => {
      queryClient.setQueryData<User>(ME_QUERY_KEY, user);
      setUser(user);
    },
  });
}
