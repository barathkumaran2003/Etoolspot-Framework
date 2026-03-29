import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Tool } from "@/lib/mock-api";

export function useTools() {
  return useQuery({
    queryKey: ["tools"],
    queryFn: api.getTools,
  });
}

export function useSaveTool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.saveTool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
  });
}

export function useDeleteTool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteTool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
  });
}
