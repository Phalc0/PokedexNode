"use client"
import { useEffect, useState } from "react";

interface Pokemon {
  _id: string;
  name: string;
  type: string[];
  imageUrl: string;
}

export default function Pokedex() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pkmn")
      .then(res => res.json())
      .then(data => {
        setPokemons(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Chargement des Pokémon...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Pokédex</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pokemons.map(p => (
          <div key={p._id} className="bg-white shadow-md rounded-lg p-4 hover:scale-105 transition">
            <img src={p.imageUrl} alt={p.name} className="w-full h-48 object-contain mb-2" />
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-gray-600">{p.type.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}