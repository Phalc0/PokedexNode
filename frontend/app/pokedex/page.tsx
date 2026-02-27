'use client';
import { useState } from 'react';
import { useAllPokemon, useSearchPokemon } from '@/hooks/usePokemon';
import { useQuery } from '@tanstack/react-query';
import { getTrainerByUsername } from '@/services/api';
import { Trainer } from '@/types/trainer';
import { useAuth } from '@/hooks/useAuth';
import PokedexHeader from '@/components/PokedexHeader';
import PokemonGrid from '@/components/PokedexGrid';
import PokedexFooter from '@/components/PokedexFooter';
import Loader from '@/components/Loader';
import '@/styles/Pokedex.css';

export default function PokedexPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  
  // Queries
  const { data: allPkmn, isLoading: loadingAll } = useAllPokemon();
  const { data: searchResult } = useSearchPokemon(search);
  const { data: trainer, isLoading: loadingTrainer } = useQuery<Trainer>({
    queryKey: ['trainer', user?.username],
    queryFn: () => getTrainerByUsername(user!.username),
    enabled: !!user?.username,
  });

  // Logique de filtrage
  const allData = allPkmn as { count: number; data: any[] } | undefined;
  const pokemons = search.length > 3 ? searchResult : allData?.data;

  if (loadingAll || loadingTrainer) return <Loader />;

  return (
    <div className="dex-layout">
      <div className="dex-side dex-side-left"><div className="half-circle" /></div>

      <div className="dex-col">
        <div className="dex-band" />
        <div className="dex-bar dex-bar-top" />

        <div className="dex-screen">
          <PokedexHeader search={search} setSearch={setSearch} />
          <PokemonGrid pokemons={pokemons} trainer={trainer} />
          {trainer && <PokedexFooter trainer={trainer} totalCount={allData?.count} />}
        </div>

        <div className="dex-bar dex-bar-bottom" />
        <div className="dex-band" />
      </div>

      <div className="dex-side dex-side-right"><div className="half-circle" /></div>
    </div>
  );
}

