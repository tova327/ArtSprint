export type CommentDTO = {
  id: number;
  content: string | null;
  userId: number;
  paintId: number;
  createdAt: string;
};

export type CommentPostModel = {
  content: string | null;
  userId: number;
  paintId: number;
};