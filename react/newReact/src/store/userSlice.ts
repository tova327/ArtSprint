import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getAllUsers, Login, Register, updateUser } from "./axioscalls"


export type UserType = {
    id: number,
    name: string,
    cameOn: string,
    email: string,
    hashedPassword: string,
    birthDate: string,
    isMedal: boolean,
    role: "member" | "admin",
    lastPaint: string

}

export type UserToAddType = {
    name: string,
    email: string,
    password: string,
    birthDate: string
}

export type UserLoginType = {
    username: string,
    password: string
}

export type QuestionsFromAIType= string[]

export const LoginAsync = createAsyncThunk<any, { user: UserLoginType }>(
    'user/login',
    async ({ user }, thunkAPI) => {
        try {
            const response = await Login(user);
            sessionStorage.setItem('token', JSON.stringify(response.token));

            return response;
        } catch (e: any) {
            console.log("error login async");
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

export const RegisterAsync = createAsyncThunk<any, { user: UserToAddType }>(
    'user/register',
    async ({ user }, thunkAPI) => {
        try {
            const response = await Register(user);
            sessionStorage.setItem('token', JSON.stringify(response.token));

            return response; // Return user data if needed
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

export const getAllUsersAsync = createAsyncThunk(
    'user/getall',
    async (_, thunkAPI) => {
        try {
            const response = await getAllUsers()
            return response;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const updateUserAsync = createAsyncThunk<any, { userId: number, userData: UserToAddType }>(
    'user/update',
    async ({ userId, userData }, thunkAPI) => {
        try {
            const response = await updateUser(userId, userData);
            return response;
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {
            id: 0,
            name: '',
            cameOn: '',
            email: '',
            hashedPassword: '',
            birthDate: '',
            isMedal: false,
            role: "member",
            lastPaint: '',
        } as unknown as UserType,
        loading: false,
        error: null as null | undefined | string,
        allusers: [] as UserType[] | null
    },
    reducers: {
        setUser(state, action) {
            console.log("setUser" + action.payload);
            state.user = action.payload.user;
        },
        logout(state) {
            state.user = null as unknown as UserType;
            sessionStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(LoginAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(LoginAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                console.log("login async " + state.user.id);

            })
            .addCase(LoginAsync.rejected, (state, action) => {
                console.log("login rejected");
                state.error = action.error.message;
                state.loading = false;
            })
            .addCase(RegisterAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(RegisterAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                console.log("registration async " + state.user.id);
            })
            .addCase(RegisterAsync.rejected, (state, action) => {
                console.log("registration rejected");
                state.error = action.error.message;
                state.loading = false;
            })
            .addCase(getAllUsersAsync.fulfilled, (state, action) => {
                state.allusers = action.payload
            })
            .addCase(getAllUsersAsync.rejected, (state, action) => {
                state.allusers = null
                console.log(action.error.message);
            })
            .addCase(updateUserAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                console.log("user updated " + state.user.id);
            })
            .addCase(updateUserAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update user';
                console.log("update user rejected: " + action.error.message);
            })
    }
});
export const { setUser,logout } = userSlice.actions
export default userSlice.reducer;
