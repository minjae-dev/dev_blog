import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const KEY = "cs_blog_views";

const load = (): Record<string, number> => {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
    catch { return {}; }
};

const persist = (v: Record<string, number>) => {
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {}
};

interface State { counts: Record<string, number>; }

const initialState: State = { counts: load() };

const viewsSlice = createSlice({
    name: "views",
    initialState,
    reducers: {
        incrementView(state, action: PayloadAction<string>) {
            const id = action.payload;
            state.counts[id] = (state.counts[id] || 0) + 1;
            persist(state.counts);
        },
    },
});

export const { incrementView } = viewsSlice.actions;
export default viewsSlice;
