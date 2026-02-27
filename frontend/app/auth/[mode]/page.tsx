'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Importe les hooks de navigation
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { AuthDexFormLayout, AuthDexInput, AuthDexButton } from '@/components/AuthDexForm';

export default function AuthPage() {
  const params = useParams();
  const router = useRouter();
  
  // On détermine le mode basé sur l'URL : /auth/login ou /auth/register
  const isLogin = params.mode === 'login';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, register, isLoading, registerLoading, error, registerError } = useAuth();

  const currentLoading = isLogin ? isLoading : registerLoading;
  const currentError = isLogin ? error : registerError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login({ email, password });
    } else {
      register({ username, email, password });
    }
  };

  return (
    <AuthDexFormLayout 
      title={isLogin ? "Connexion" : "Inscription"} 
      subtitle={isLogin ? "Identifie-toi, Dresseur" : "Deviens Dresseur, Pokémon t'attend"} 
      error={currentError}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        
        {!isLogin && (
          <AuthDexInput 
            type="text" 
            placeholder="Nom de dresseur" 
            value={username} 
            onChange={setUsername} 
          />
        )}

        <AuthDexInput 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={setEmail} 
        />
        
        <AuthDexInput 
          type="password" 
          placeholder="Mot de passe" 
          value={password} 
          onChange={setPassword} 
        />

        <AuthDexButton loading={currentLoading}>
          {isLogin ? "Se connecter" : "S'inscrire"}
        </AuthDexButton>

        <div style={{ textAlign: 'center', marginTop: 4 }}>
          {/* Ici on utilise Link pour changer l'URL proprement */}
          <Link 
            href={isLogin ? "/auth/register" : "/auth/login"}
            style={{
              fontSize: 11, color: 'rgba(5,50,70,0.6)', fontFamily: "'Exo 2', sans-serif",
              fontWeight: 600, letterSpacing: '0.05em', textDecoration: 'none',
              borderBottom: '1px solid rgba(5,50,70,0.2)', paddingBottom: 1
            }}
          >
            {isLogin 
              ? "Pas encore de compte ? S'inscrire →" 
              : "Déjà un compte ? Se connecter →"}
          </Link>
        </div>
      </form>
    </AuthDexFormLayout>
  );
}