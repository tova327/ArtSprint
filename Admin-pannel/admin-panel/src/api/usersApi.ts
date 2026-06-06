import type { UserPostModel } from "../types/user.types";
import { axiosClient } from "./axiosClient";

export const getUsers = async () => {
  return axiosClient.get("/user");
};

export const createUser = async (data: UserPostModel) => {
  return axiosClient.post("/user", data);
};

export const updateUser = async (
  id: number,
  data: UserPostModel
) => {
  return axiosClient.put(`/user/${id}`, data);
};

export const deleteUser = async (id: number) => {
  return axiosClient.delete(`/user/${id}`);
};