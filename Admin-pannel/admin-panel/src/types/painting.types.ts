export type PaintingDTO = {
  id: number;
  ownerId: number;
  name: string | null;
  createdAt: string;
  likes: number;
  url: string | null;
  isMedal: boolean;
  categoryId: number;
  comments: any[];
  competitionPainting: any;
};

export type PaintingPostModel = {
  ownerId: number;
  name: string | null;
  categoryId: number;
  paintingFile: File | null;
};