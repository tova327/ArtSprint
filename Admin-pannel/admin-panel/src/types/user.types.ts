import type { CommentDTO } from "./comment.types";
import type { PaintingDTO } from "./painting.types";

export type UserDTO = {
  id: number;
  name: string | null;
  email: string | null;
  password: string | null;
  cameOn: string;
  birthDate: string;
  role:"member" | "admin";
  isMedal: boolean;
  lastPaint: string | null;
  paintings: PaintingDTO[];
  comments: CommentDTO[];
};

export type UserPostModel = {
  name: string | null;
  birthDate: string;
  email: string | null;
  password: string | null;
  role:"member" | "admin";
};
export type AuthContextType = {
  user: UserDTO | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};