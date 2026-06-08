import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPaintings,
  createPainting,
  updatePainting,
  deletePainting,
} from "../api/paintingsApi";
import { type PaintingDTO, type PaintingPostModel } from "../types/painting.types";

export const usePaintings = () => {
  return useQuery<PaintingDTO[]>({
    queryKey: ["paintings"],
    queryFn: async () => {
      const res = await getPaintings();
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreatePainting = () => {
  const queryClient = useQueryClient();

  return useMutation<PaintingDTO, unknown, PaintingPostModel>({
    mutationFn: async (data) => {
      const res = await createPainting(data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["paintings"],
      });
    },
  });
};

export const useUpdatePainting = () => {
  const queryClient = useQueryClient();

  return useMutation<PaintingDTO, unknown, { id: number; data: PaintingPostModel }>({
    mutationFn:async ({
      id,
      data,
    }: {
      id: number;
      data: PaintingPostModel;
    }) => {
      const res = await updatePainting(data, id);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["paintings"],
      });
    },
  });
};

export const useDeletePainting = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, number>({
    mutationFn: async (id: number) => {
      const res = await deletePainting(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["paintings"],
      });
    },
  });
};