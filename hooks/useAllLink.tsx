"use client";

import { getAllLink } from "@/lib/utils/getAllLink";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useAllLink = () => {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["all-links", session?.user?.email],
    queryFn: () => getAllLink(),
    enabled: !!session,
    staleTime: 1000 * 60 * 5,
  });
};