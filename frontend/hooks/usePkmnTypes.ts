"use client";

import { useQuery } from "@tanstack/react-query";
import { searchPkmn } from "@/services/api";

export const useSearchPkmn = (query: any) => {
  return useQuery({
    queryKey: ["pokemonSearch", query],
    queryFn: () => searchPkmn(query),
    enabled: !!query,
  });
};