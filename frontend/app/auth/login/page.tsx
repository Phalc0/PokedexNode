'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth'; // Importe ton hook
import Link from 'next/link';
import { DexFormLayout, DexInput, DexButton } from '@/components/DexFormLayout';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // On récupère tout ce qu'il faut du hook
  const { login, isLoading, error, logout } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <DexFormLayout title="Connexion" subtitle="Identifie-toi, Dresseur" error={error}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <DexInput type="email" placeholder="Email" value={email} onChange={setEmail} />
        <DexInput type="password" placeholder="Mot de passe" value={password} onChange={setPassword} />

        <DexButton loading={isLoading}>Se connecter</DexButton>

        <div style={{ textAlign: 'center', marginTop: 4 }}>
          <Link href="/auth/register" style={{
            fontSize: 11, color: 'rgba(5,50,70,0.6)', fontFamily: "'Exo 2', sans-serif",
            fontWeight: 600, letterSpacing: '0.05em', textDecoration: 'none',
            borderBottom: '1px solid rgba(5,50,70,0.2)', paddingBottom: 1
          }}>
            Pas encore de compte ? S'inscrire →
          </Link>
        </div>
      </form>
    </DexFormLayout>
  );
}