import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCategories, fetchCategoryById } from "./axioscalls";

export type CategoryType = {
    id: number;
    name: string;
    description?: string;
    parentCategoryId?: number;
    subCategories: CategoryType[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export const getCategoryHierarchy = (categories: CategoryType[], parentId: number | null = null): CategoryType[] => {
    return categories
        .filter(category => category.parentCategoryId === parentId) 
        .map(category => ({
            ...category,
            subCategories: getCategoryHierarchy(categories, category.id)
        }));
};

export const getCategoryPath = (categories: CategoryType[], categoryId: number): string => {
    const categoryMap = new Map(categories.map(c => [c.id, c]));
    const path: string[] = [];
    let currentId: number | null |undefined = categoryId;

    while (currentId !== null) {
        const category = categoryMap.get(currentId??0);
        if (!category) break;
        path.unshift(category.name);
        currentId = category.parentCategoryId;
    }

    return path.join(' > ');
};
export const getCategoryNameById = (categories: CategoryType[], categoryId: number): string => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "Unknown";
};

export const fetchCategoriesAsync = createAsyncThunk(
    'categories/fetchAll',
    async (_, thunkAPI) => {
        try {
            const response = await fetchCategories();
            return response;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

export const fetchCategoryByIdAsync = createAsyncThunk(
    'categories/fetchById',
    async (id: number, thunkAPI) => {
        try {
            const response = await fetchCategoryById(id);
            return response;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [] as CategoryType[],
        loading: false,
        error: null as null | string | undefined,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategoriesAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
                console.log(action.payload);
            })
            .addCase(fetchCategoriesAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchCategoryByIdAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategoryByIdAsync.fulfilled, (state, action) => {
                state.loading = false;
                const category = action.payload;
                const index = state.categories.findIndex(c => c.id === category.id);
                if (index !== -1) {
                    state.categories[index] = category;
                } else {
                    state.categories.push(category);
                }
            })
            .addCase(fetchCategoryByIdAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default categorySlice.reducer;