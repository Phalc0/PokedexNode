"use client";

import { useMutation } from "@tanstack/react-query";
import { login, register, checkToken } from "@/services/api";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      router.push("/");
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      router.push("/login");
    },
  });

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const verifyToken = async () => {
    try {
      await checkToken();
      return true;
    } catch {
      logout();
      return false;
    }
  };

  return {
    login: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error,

    register: registerMutation.mutate,
    registerLoading: registerMutation.isPending,
    registerError: registerMutation.error,

    logout,
    verifyToken,
  };
};