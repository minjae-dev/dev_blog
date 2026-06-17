import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const KEY = "cs_blog_notes";

const load = (): Record<string, string> => {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
    catch { return {}; }
};

const persist = (v: Record<string, string>) => {
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {}
};

interface State { notes: Record<string, string>; }

const initialState: State = { notes: load() };

const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        setNote(state, action: PayloadAction<{ id: string; text: string }>) {
            const { id, text } = action.payload;
            if (text.trim()) {
                state.notes[id] = text;
            } else {
                delete state.notes[id];
            }
            persist(state.notes);
        },
    },
});

export const { setNote } = notesSlice.actions;
export default notesSlice;
