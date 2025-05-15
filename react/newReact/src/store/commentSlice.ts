import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchComments, addComment, updateComment, deleteComment } from "./axioscalls";

export type CommentType = {
    id: number;
    content: string;
    userId: number;
    paintId: number;
    createdAt:Date;
};

export type CommentPostModel = {
    content: string;
    userId: number;
    paintId: number;
};

export const fetchCommentsAsync = createAsyncThunk(
    'comments/fetch',
    async (_, thunkAPI) => {
        try {
            const response = await fetchComments();
            return response;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

export const addCommentAsync = createAsyncThunk(
    'comments/add',
    async ({ comment, token }: { comment: CommentPostModel; token: string }, thunkAPI) => {
        try {
            const response = await addComment(comment, token);
            return response;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

export const updateCommentAsync = createAsyncThunk(
    'comments/update',
    async ({ id, comment, token }: { id: number; comment: CommentPostModel; token: string }, thunkAPI) => {
        try {
            const response = await updateComment(id, comment, token);
            return response;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

export const deleteCommentAsync = createAsyncThunk(
    'comments/delete',
    async ({ id, token }: { id: number; token: string }, thunkAPI) => {
        try {
            await deleteComment(id, token);
            return id; // return the id to remove it from the state
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

const commentSlice = createSlice({
    name: 'comments',
    initialState: {
        comments: [] as CommentType[],
        loading: false,
        error: null as null | string,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCommentsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCommentsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload;
            })
            .addCase(fetchCommentsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addCommentAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCommentAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.comments.push(action.payload);
            })
            .addCase(addCommentAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateCommentAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCommentAsync.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.comments.findIndex(comment => comment.id === action.payload.id);
                if (index !== -1) {
                    state.comments[index] = action.payload;
                }
            })
            .addCase(updateCommentAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteCommentAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCommentAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = state.comments.filter(comment => comment.id !== action.payload);
            })
            .addCase(deleteCommentAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default commentSlice.reducer;
