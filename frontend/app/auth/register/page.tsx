'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register, login, createTrainer } from '@/services/api';
import Link from 'next/link';
import { DexFormLayout, DexInput, DexButton } from '@/components/DexFormLayout';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ username, email, password });
      await login({ email, password });
      await createTrainer({
        username,
        trainerName: username,
        imgUrl: 'https://play.pokemonshowdown.com/sprites/trainers/hilbert.png',
        creationDate: new Date().toISOString(),
        pkmnSeen: [],
        pkmnCaught: [],
      });
      router.push('/auth/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DexFormLayout title="Inscription" subtitle="Deviens Dresseur, Pokémon t'attend" error={error}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <DexInput type="text"     placeholder="Nom de dresseur" value={username} onChange={setUsername} />
        <DexInput type="email"    placeholder="Email"            value={email}    onChange={setEmail} />
        <DexInput type="password" placeholder="Mot de passe"     value={password} onChange={setPassword} />
        <DexButton loading={loading}>S'inscrire</DexButton>
        <div style={{ textAlign: 'center', marginTop: 4 }}>
          <Link href="/auth/login" style={{
            fontSize: 11, color: 'rgba(5,50,70,0.6)', fontFamily: "'Exo 2', sans-serif",
            fontWeight: 600, letterSpacing: '0.05em', textDecoration: 'none',
            borderBottom: '1px solid rgba(5,50,70,0.2)', paddingBottom: 1
          }}>
            Déjà un compte ? Se connecter →
          </Link>
        </div>
      </form>
    </DexFormLayout>
  );
}
