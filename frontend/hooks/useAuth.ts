'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation'; // Ajout pour la redirection
import api from '@/services/api';

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
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post('/auth/login', data);
      return res.data;
    },
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

  return {
    user,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    error: (loginMutation.error as any)?.response?.data?.message || null,
    logout, // Maintenant, logout existe bien dans le scope !
  };
}