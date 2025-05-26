import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getAllUsers, Login, Register } from "./axioscalls"


export type UserType={
    id:number,
    name:string,
    cameOn:Date,
    email:string,
    hashedPassword:string,
    birthDate:Date,
    isMedal:boolean,
    role:"member"|"admin",
    lastPaint:Date,
    
}

export type UserToAddType={
    name:string,
    email:string,
    password:string,
    birthDate:Date
}

export type UserLoginType={
    username:string,
    password:string
}



export const LoginAsync = createAsyncThunk<any, { user: UserLoginType }>(
    'user/login',
    async ({ user }, thunkAPI) => {
        try {
            const response = await Login(user);
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
            return response; // Return user data if needed
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
);

export const getAllUsersAsync=createAsyncThunk(
    'user/getall',
    async({token}:{token:string},thunkAPI)=>{
        try {
            const response = await getAllUsers(token)
            return response; 
        } catch (e: any) {
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {
            id: 0,
            name: '',
            cameOn: Date.now(),
            email: '',
            hashedPassword: '',
            birthDate: Date.now(),
            isMedal: false,
            role: "member",
            lastPaint: Date.now(),
        } as unknown as UserType,
        token: null as string | null|undefined,  // This may be kept for future use or removed
        loading: false,
        error: null as null | undefined | string,
        allusers:[]as UserType[]|null
    },
    reducers: {
        setUser(state, action) {
            console.log("setUser"+action.payload);
            
            state.user = action.payload.user;
            state.token=action.payload.token
            console.log("local token"+state.token);
            if(state.token)localStorage.setItem('authToken',state.token)
        },
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
                state.token=action.payload.token
                if(state.token)localStorage.setItem('authToken',state.token)
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
                state.token=action.payload.token
                if(state.token)localStorage.setItem('authToken',state.token)
            })
            .addCase(RegisterAsync.rejected, (state, action) => {
                console.log("registration rejected");
                state.error = action.error.message;
                state.loading = false;
            })
            .addCase(getAllUsersAsync.fulfilled,(state,action)=>{
                state.allusers=action.payload
            })
            .addCase(getAllUsersAsync.rejected,(state,action)=>{
                state.allusers=null
                console.log(action.error.message);
            })
    }
});
export const {setUser}=userSlice.actions
export default userSlice.reducer;
