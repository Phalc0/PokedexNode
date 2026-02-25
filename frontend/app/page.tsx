import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-4xl font-bold">Bienvenue dans le Pokédex</h1>
      <div className="flex gap-4">
        <Link
          href="/pokedex"
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Pokedex
        </Link>
        <Link
          href="/trainer"
          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Trainer
        </Link>
      </div>
    </div>
  );
}