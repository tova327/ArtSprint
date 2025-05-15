import { configureStore } from "@reduxjs/toolkit";
import paintingReducer from './paintingSlice';
import userReducer from './userSlice';
import commentReducer from './commentSlice'; // Import the comment reducer

const store = configureStore({
    reducer: {
        painting: paintingReducer,
        user: userReducer,
        comments: commentReducer, // Add the comment reducer here
    }
});

export type StoreType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
