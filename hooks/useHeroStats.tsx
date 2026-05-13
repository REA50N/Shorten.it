import { useQuery } from "@tanstack/react-query";

export const useHeroStats = () => {
  return useQuery({
    queryKey: ["hero-stats"],
    queryFn: async () => {
      const response = await fetch("/api/metrics");
      const data = await response.json();
      return data;
    },
  });
};
