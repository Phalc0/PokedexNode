import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllPkmn, getPkmnById, searchPkmn } from '../services/api';

// Hook pour tous les Pokémon
export const useAllPokemon = () => {
  return useQuery({
    queryKey: ['pokemon'],
    queryFn: getAllPkmn,
  });
};

// Hook pour un Pokémon par ID
export const usePokemon = (id: string | null) => {
  return useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => getPkmnById(id!),
    enabled: !!id, // Ne lance la requête que si id existe
  });
};

// Hook pour la recherche
export const useSearchPokemon = (query: string) => {
  return useQuery({
    queryKey: ['pokemon', 'search', query],
    queryFn: () => searchPkmn(query),
    enabled: query.length > 3,
  });
};

// Hook markpkmn