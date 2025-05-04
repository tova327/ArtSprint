import { configureStore } from "@reduxjs/toolkit";
import paintingReducer from './paintingSlice';
import userReducer from './userSlice'

const store=configureStore({
    reducer:{
        painting:paintingReducer,
        user:userReducer
    }
})
export type StoreType = ReturnType<typeof store.getState>
export type AppDispatch= typeof store.dispatch
export default store