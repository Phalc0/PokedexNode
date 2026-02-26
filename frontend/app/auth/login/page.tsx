'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/api'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Appel à l'API login
      const data = await login({ email, password });
      console.log('Login réussi :', data);

      // Redirection vers Pokedex ou home
      router.push('/'); // change si tu as une page spécifique
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Erreur serveur');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Connexion</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Se connecter
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}