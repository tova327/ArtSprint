import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Login, Register } from "./axioscalls"


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

export const LoginAsync=createAsyncThunk(
    'user/login',
    async({user}:{user:UserLoginType},thunkAPI)=>{
        try{
            const response=await Login(user)
            return response
        }catch(e:any){
            console.log("error login async");
            
            return thunkAPI.rejectWithValue(e.message)
        }
    }
)

export const RegisterAsync=createAsyncThunk(
    'user/register',
    async({user}:{user:UserToAddType},thunkAPI)=>{
        try{
            const response=await Register(user)
            return response
        }catch(e:any){
            return thunkAPI.rejectWithValue(e.message)
        }
    }
)

const userSlice=createSlice({
    name:'user',
    initialState:{
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
            
        } as unknown   as UserType,
        token:null as string|null,
        loading:false,
        error:null as null|undefined|string
    },
    reducers:{

    },
    extraReducers:(builder)=>{
        builder
        .addCase(LoginAsync.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        .addCase(LoginAsync.fulfilled,(state,action)=>{
            state.loading=false,
            state.token=action.payload.token
        })
        .addCase(LoginAsync.rejected ,(state,action)=>{
            console.log("login rejected");
            console.log(state.error);
            state.error=action.error.message
            state.loading=false
        })
        .addCase(RegisterAsync.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        .addCase(RegisterAsync.fulfilled,(state,action)=>{
            state.loading=false
            state.token=action.payload.token
        })
        .addCase(RegisterAsync.rejected,(state,action)=>{
            console.log("login rejected");
            state.error=action.error.message
            console.log(state.error);
            
            state.loading=false
        })
    }
})

export default userSlice.reducer