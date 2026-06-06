import type { PaintingPostModel } from "../types/painting.types";
import { axiosClient } from "./axiosClient";

export const getPaintings = async () => {
  return axiosClient.get("/painting");
};

export const deletePainting = async (id: number) => {
  return axiosClient.delete(`/painting/${id}`);
};

export const updatePainting = async (
  paintingToUpdate: PaintingPostModel,id:number
) => {
  return axiosClient.put(`/painting/${id}`, paintingToUpdate);
};

export const createPainting = async (
  data: PaintingPostModel
) => {
  const formData = new FormData();

  formData.append("ownerId", String(data.ownerId));
  formData.append("name", data.name || "");
  formData.append(
    "categoryId",
    String(data.categoryId)
  );

  if (data.paintingFile) {
    formData.append("paintingFile", data.paintingFile);
  }

  return axiosClient.post("/painting/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};