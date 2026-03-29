import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type User } from "@/lib/mock-api";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: api.getUsers,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<User> }) => api.updateUser(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}
