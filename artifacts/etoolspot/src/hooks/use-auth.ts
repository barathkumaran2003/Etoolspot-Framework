import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type User } from "@/lib/mock-api";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: api.getCurrentUser,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.login,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.signup,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      queryClient.clear();
    },
  });
}
