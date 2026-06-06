import { axiosClient } from "./axiosClient";

export const getComments = async () => {
  return axiosClient.get("/comment");
};

export const deleteComment = async (
  id: number
) => {
  return axiosClient.delete(`/comment/${id}`);
};