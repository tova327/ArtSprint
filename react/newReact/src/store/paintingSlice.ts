import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addLike, addPainting, fetchPaintings, uploadPainting } from "./axioscalls";

export const ESubject = [
    'Music',
    'Drawing',
    'Photography',
    'Graphic',
    'Writing'
];

export type PaintingType = {
    id: number,
    ownerId: number,
    name: string,
    createdAt: Date,
    likes: number,
    url: string,
    isMedal: boolean,
    subject: number,
};

export type PaintingToAddType = {
    ownerId: number,
    name: string,
    subject: number,
    paintingFile: File
};

// Fetch paintings
export const fetchPaintingsAsync = createAsyncThunk(
    'paintings/fetch',
    async (_, thunkAPI) => {
        try {
            const response = await fetchPaintings();
            return response;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

// Add painting
export const addPaintingAsync = createAsyncThunk(
    'paintings/add',
    async ({ painting, token }: { painting: PaintingToAddType, token: string }, thunkAPI) => {
        try {
            const response = await addPainting(painting, token);
            return response;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

// Upload painting
export const uploadPaintingAsync = createAsyncThunk(
    'paintings/upload',
    async ({ painting, token }: { painting: PaintingToAddType, token: string }, thunkAPI) => {
        try {
            const response = await uploadPainting(painting, token);
            return response;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

// Add like
export const addLikeAsync = createAsyncThunk(
    'paintings/like',
    async ({ id, count, token }: { id: number, count: number, token: string }, thunkAPI) => {
        try {
            const response = await addLike(id, count, token);
            return response;
        } catch (e: any) {
            thunkAPI.rejectWithValue(e.message);
        }
    }
);

const paintingSlice = createSlice({
    name: 'painting',
    initialState: {
        paintings: [] as PaintingType[],
        loading: false,
        error: null as null | string|undefined,
    },
    reducers: {
        addLikeR: (state, action) => {
            state.paintings = state.paintings.map(p => {
                if (p.id === action.payload) p.likes++;
                return p;
            });
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPaintingsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPaintingsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.paintings = action.payload;
            })
            .addCase(fetchPaintingsAsync.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            .addCase(addPaintingAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPaintingAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.paintings.push(action.payload);
            })
            .addCase(addPaintingAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(uploadPaintingAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadPaintingAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.paintings.push(action.payload);
            })
            .addCase(uploadPaintingAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export const { addLikeR } = paintingSlice.actions;
export default paintingSlice.reducer;
