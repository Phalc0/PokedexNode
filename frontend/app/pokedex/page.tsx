'use client';

import { useState, useEffect } from 'react';
import { useAllPokemon, useSearchPokemon } from '@/hooks/usePokemon';

export default function PokedexPage() {
  const [search, setSearch] = useState('');
  const { data: allPkmn, isLoading: loadingAll } = useAllPokemon();
  const { data: searchResult, isLoading} = useSearchPokemon(search);

  // Log des données brutes
  console.log('Recherche actuelle :', search);
  console.log('All Pokémon:', allPkmn);
  console.log('Résultats de recherche:', searchResult);
  console.log('Loading All:', loadingAll, 'Loading Search:');

  const allData = allPkmn as { count: number; data: any[] } | undefined;
  const pokemons = search.length > 3 ? searchResult : allData?.data;

  // Log des Pokémon affichés
  console.log('Pokémon affichés:', pokemons);

  if (loadingAll) {
    console.log('Chargement en cours...');
    return <Loader />;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Pokédex</h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            console.log('Nouvelle valeur recherche :', e.target.value);
          }}
          placeholder="Rechercher un Pokémon..."
          className="border rounded px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {pokemons && pokemons.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pokemons.map((p: any) => (
            <CardPokemon key={p._id} pokemon={p} />
          ))}
        </div>
      ) : (
        <p className="text-center">Aucun Pokémon trouvé.</p>
      )}
    </div>
  );
}

// -------------------------
// Composants internes
// -------------------------

function CardPokemon({ pokemon }: { pokemon: any }) {
  console.log('Rendu CardPokemon:', pokemon);
  return (
    <div className="border rounded shadow hover:shadow-lg p-4 text-center transition">
      <img src={pokemon.imgUrl} alt={pokemon.name} className="w-32 h-32 mx-auto mb-2" />
      <h2 className="font-bold text-xl">{pokemon.name}</h2>
      <p className="text-sm text-gray-600">
        Type: {pokemon.types?.join(', ') || 'Inconnu'}
      </p>
    </div>
  );
}

function Loader() {
  console.log('Affichage Loader');
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
}