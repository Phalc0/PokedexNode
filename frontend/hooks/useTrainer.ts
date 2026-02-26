"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTrainerById,
  updateTrainer,
  deleteTrainer,
  markPkmn,
  createTrainer,
} from "@/services/api";

export const useTrainer = () => {
  const queryClient = useQueryClient();

  const trainerQuery = useQuery({
    queryKey: ["trainers"],
    queryFn: getTrainerById,
  });

  const createMutation = useMutation({
    mutationFn: createTrainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainers"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTrainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainers"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTrainer,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["trainers"] });
    },
  });

  const markMutation = useMutation({
    mutationFn: ({
      pkmnId,
      isCaught,
    }: {
      pkmnId: string;
      isCaught: boolean;
    }) => markPkmn(pkmnId, isCaught),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainers"] });
    },
  });

  return {
    trainer: trainerQuery.data,
    loading: trainerQuery.isLoading,
    error: trainerQuery.error,

    createTrainer: createMutation.mutate,
    updateTrainer: updateMutation.mutate,
    deleteTrainer: deleteMutation.mutate,
    markPkmn: markMutation.mutate,
  };
};