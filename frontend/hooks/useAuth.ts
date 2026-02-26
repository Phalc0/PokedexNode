'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/services/api';

type User = {
  id: string;
  email: string;
  username: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  // Charger user au refresh
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
    },
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    logout,
  };
}