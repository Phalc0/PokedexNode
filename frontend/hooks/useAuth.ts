'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation'; // Ajout pour la redirection
import api from '@/services/api';
import { register, login, createTrainer } from '@/services/api';

type User = {
  id: string;
  email: string;
  username: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      router.push('/pokedex');
    },
  });

  // Cette fonction DOIT être ici, avant le return
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/auth/login'); // Optionnel : renvoie au login après déco
  };

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      // 1. Inscription
      await register({ username: data.username, email: data.email, password: data.password });

      // 2. Connexion pour récupérer le token
      const loginRes = await login({ email: data.email, password: data.password });

      // 3. Création du profil dresseur
      await createTrainer({
        username: data.username,
        trainerName: data.username,
        imgUrl: 'https://play.pokemonshowdown.com/sprites/trainers/hilbert.png',
        creationDate: new Date().toISOString(),
        pkmnSeen: [],
        pkmnCaught: [],
      });

      return loginRes; // On retourne le résultat du login pour le onSuccess
    },
    onSuccess: (data) => {
      // On stocke les infos et on redirige
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      router.push('/pokedex');
    },
  });


  return {
    user,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    error: (loginMutation.error as any)?.response?.data?.message || null,
    logout,

    register: registerMutation.mutate,
    registerLoading: registerMutation.isPending,
    registerError: (registerMutation.error as any)?.response?.data?.message || null,
  };
}