import type { CategoryPostModel } from "../types/category.types";
import { axiosClient } from "./axiosClient";

export const getCategories = async () => {
  return axiosClient.get("/category");
};

export const createCategory = async (
  data: CategoryPostModel
) => {
  return axiosClient.post("/category", data);
};

export const updateCategory = async (
  id: number,
  data: CategoryPostModel
) => {
  return axiosClient.put(`/category/${id}`, data);
};

export const deleteCategory = async (
  id: number
) => {
  return axiosClient.delete(`/category/${id}`);
};