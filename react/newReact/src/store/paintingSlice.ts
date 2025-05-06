import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { addLike, addPainting, fetchPaintings } from "./axioscalls"
//import initialPaintingsState from "./initialPaintingsStateTmp"

export const ESubject =[
    'Music',
    'Drawing',
    'Photography',
    'Graphic',
    'Writing'
]
export type PaintingType = {
    id: number,
    ownerId: number,
    name: string,
    createdAt: Date,
    likes: number,
    url: string,
    isMedal: boolean,
    subject: number,
}
export type PaintingToAddType = {
    ownerId: number,
    name: string,
    subject: number,
    paintingFile: File

}

// upload painting+post
// get paintings
// add like


export const fetchPaintingsAsync = createAsyncThunk(
    'paintings/fetch',
    async (_, thunkAPI) => {
        try {
            const response = await fetchPaintings();
            return response
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message)
        }

    }
)

export const addPaintingAsync = createAsyncThunk(
    'paintings/add',
    async ({ painting, token }: { painting: PaintingToAddType, token: string }, thunkAPI) => {
        try {
            const response = await addPainting(painting, token);
            return response
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message)
        }

    }
)

export const addLikeAsync = createAsyncThunk(
    'paintings/like',
    async ({ id, count, token }: { id: number, count: number, token: string }, thunkAPI) => {
        console.log(count+'  add like async');
        
        try {
            const response = await addLike(id, count, token);
            return response
        } catch (e: any) {
            thunkAPI.rejectWithValue(e.message)
        }
    }
)

const paintingSlice = createSlice({
    name: 'painting',
    initialState: {
        paintings: [
            {
                id: 1,
                ownerId: 3,
                name: 'family',
                createdAt: Date.now(),
                likes: 10000000,
                url: 'https://storage.cloud.google.com/art-sprint-bucket/0-2300.jpg',
                isMedal: true,
                subject: 3
            }
        ] as unknown as PaintingType[],
        loading: false,
        error: null as null | undefined | string
    },
    reducers: {
        addLikeR: (state, action) => {
            state.paintings = [...state.paintings.map(p => { if (p.id === action.payload) p.likes++; return p })]
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPaintingsAsync.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchPaintingsAsync.fulfilled, (state, action) => {
                state.loading = false
                state.paintings = [...action.payload]
            })
            .addCase(fetchPaintingsAsync.rejected, (state, action) => {
                state.error = action.error.message
                state.loading = false
            })
            .addCase(addPaintingAsync.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addPaintingAsync.fulfilled, (state, action) => {
                state.loading = false,
                    state.paintings = [...state.paintings, action.payload]
            })
            .addCase(addPaintingAsync.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.error.message
            })
            .addCase(addLikeAsync.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addLikeAsync.fulfilled, (state) => {
                state.loading = false
                /////////////////////?????????????????????????
            })
            .addCase(addLikeAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })

    }
})
export const { addLikeR } = paintingSlice.actions;
export default paintingSlice.reducer

