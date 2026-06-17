import { configureStore } from "@reduxjs/toolkit";
import postsSlice from "./postsSlice";
import authSlice from "./authSlice";

const store = configureStore({
    reducer: {
        posts: postsSlice.reducer,
        auth: authSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
