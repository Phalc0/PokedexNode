// hooks/useTrainer.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTrainerById,
  updateTrainer,
  deleteTrainer,
  markPkmn,
  createTrainer,
} from "@/services/api";

export const useTrainer = (trainerId: string) => {
  const queryClient = useQueryClient();

  const trainerQuery = useQuery({
    queryKey: ["trainer", trainerId],
    queryFn: () => getTrainerById(trainerId),
    enabled: !!trainerId,
  });

  const createMutation = useMutation({
    mutationFn: createTrainer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trainers"] }),
  });

  const updateMutation = useMutation({
    mutationFn: updateTrainer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trainer", trainerId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTrainer,
    onSuccess: () => queryClient.removeQueries({ queryKey: ["trainer", trainerId] }),
  });

  const markMutation = useMutation({
    mutationFn: ({ pkmnId, isCaught }: { pkmnId: string; isCaught: boolean }) =>
      markPkmn(pkmnId, isCaught),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trainer", trainerId] }),
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

export interface Trainer {
  _id: string;
  username: string;
  imgUrl: string;
  trainerName: string;
  creationDate: string;
  pkmnSeen: any[];
  pkmnCaught: any[];
}