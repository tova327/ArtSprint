import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getComments, deleteComment } from "../api/commentsApi";
import type { CommentDTO } from "../types/comment.types";
   

export const useComments = () => {
  return useQuery<CommentDTO[]>({
    queryKey: ["comments"],
    queryFn: async () => {
      const res = await getComments();
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, number>({
    mutationFn: async (id: number) => {
      const res = await deleteComment(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
  });
};