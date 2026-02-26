'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Bienvenue dans ton Pokédex !</h1>
      <p className="mb-6">Explore et capture tous les Pokémon.</p>
      <Link href="/pokedex">
        <button className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">
          Accéder au Pokédex
        </button>
      </Link>
    </div>
  );
}