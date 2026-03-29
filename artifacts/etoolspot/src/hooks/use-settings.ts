import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Settings } from "@/lib/mock-api";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: api.getSettings,
  });
}

export function useSaveSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.saveSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(["settings"], data);
      
      // Update CSS variables globally immediately
      document.documentElement.style.setProperty('--primary', data.primaryColor);
      document.documentElement.style.setProperty('--secondary', data.secondaryColor);
    },
  });
}
