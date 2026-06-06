export type CategoryDTO = {
  id: number;
  name: string | null;
  description: string | null;
  parentCategoryId: number | null;
  subCategories: CategoryDTO[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CategoryPostModel = {
  name: string | null;
  description: string | null;
  parentCategoryId: number | null;
  isActive: boolean;
};