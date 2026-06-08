import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CategoryDTO, CategoryPostModel } from "../types/category.types";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../api/categoriesApi";

export const useCategories = () => {
  return useQuery<CategoryDTO[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategories();
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<CategoryDTO, unknown, CategoryPostModel>({
    mutationFn:async (categoryData) => {
      const res = await createCategory(categoryData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<CategoryDTO, unknown, { id: number; data: CategoryPostModel }>({
    mutationFn: async ({ id, data }) => {
      const res = await updateCategory(id, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, number>({
    mutationFn: async (id: number) => {
      const res = await deleteCategory(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};