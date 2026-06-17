import { configureStore } from "@reduxjs/toolkit";
import postsSlice from "./postsSlice";
import authSlice from "./authSlice";
import goalsSlice from "./goalsSlice";
import bookmarksSlice from "./bookmarksSlice";
import viewsSlice from "./viewsSlice";
import notesSlice from "./notesSlice";

const store = configureStore({
    reducer: {
        posts: postsSlice.reducer,
        auth: authSlice.reducer,
        goals: goalsSlice.reducer,
        bookmarks: bookmarksSlice.reducer,
        views: viewsSlice.reducer,
        notes: notesSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
