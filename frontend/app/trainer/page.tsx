"use client"
import { useEffect, useState } from "react";

interface Pokemon {
  _id: string;
  name: string;
  type: string[];
  imageUrl: string;
  isCaptured: boolean;
}

interface Trainer {
  username: string;
  pokemons: Pokemon[];
}

export default function Trainer() {
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trainers/me") // Endpoint pour récupérer le trainer courant
      .then(res => res.json())
      .then(data => {
        setTrainer(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toggleCapture = async (pokemonId: string) => {
    if (!trainer) return;

    try {
      const res = await fetch("/api/trainers/markPkmn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pokemonId })
      });
      const data = await res.json();
      if (res.ok) {
        setTrainer({
          ...trainer,
          pokemons: trainer.pokemons.map(p =>
            p._id === pokemonId ? { ...p, isCaptured: !p.isCaptured } : p
          )
        });
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Chargement du Trainer...</p>;
  if (!trainer) return <p className="text-center mt-10">Aucun trainer trouvé</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Trainer: {trainer.username}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {trainer.pokemons.map(p => (
          <div key={p._id} className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
            <img src={p.imageUrl} alt={p.name} className="w-32 h-32 object-contain mb-2" />
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-gray-500">{p.type.join(", ")}</p>
            <button
              className={`mt-2 px-4 py-2 rounded ${
                p.isCaptured ? "bg-red-500 text-white" : "bg-green-500 text-white"
              }`}
              onClick={() => toggleCapture(p._id)}
            >
              {p.isCaptured ? "Relâcher" : "Capturer"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}