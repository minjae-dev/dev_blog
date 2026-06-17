import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const KEY = "cs_blog_bookmarks";

const load = (): string[] => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
    catch { return []; }
};

const persist = (ids: string[]) => {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch {}
};

interface State { ids: string[]; }

const initialState: State = { ids: load() };

const bookmarksSlice = createSlice({
    name: "bookmarks",
    initialState,
    reducers: {
        toggleBookmark(state, action: PayloadAction<string>) {
            const id = action.payload;
            if (state.ids.includes(id)) {
                state.ids = state.ids.filter((i) => i !== id);
            } else {
                state.ids.push(id);
            }
            persist(state.ids);
        },
        clearBookmarks(state) {
            state.ids = [];
            persist([]);
        },
    },
});

export const { toggleBookmark, clearBookmarks } = bookmarksSlice.actions;
export default bookmarksSlice;
