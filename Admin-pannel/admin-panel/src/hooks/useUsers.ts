import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/usersApi";
import type { UserDTO, UserPostModel } from "../types/user.types";

export const useUsers = () => {
  return useQuery<UserDTO[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await getUsers();
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UserDTO, unknown, UserPostModel>({
    mutationFn: async (data: UserPostModel) => {
      const res = await createUser(data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UserDTO, unknown, { id: number; data: UserPostModel }>({
    mutationFn:async ({
      id,
      data,
    }: {
      id: number;
      data: UserPostModel;
    }) => {
      const res = await updateUser(id, data);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, number>({
    mutationFn: async (id: number) => {
      const res = await deleteUser(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
};