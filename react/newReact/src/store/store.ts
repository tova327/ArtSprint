import { configureStore } from "@reduxjs/toolkit";
import paintingReducer from './paintingSlice';

const store=configureStore({
    reducer:{
        painting:paintingReducer,

    }
})
export type StoreType = ReturnType<typeof store.getState>
export type AppDispatch= typeof store.dispatch
export default store