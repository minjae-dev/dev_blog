import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";

export interface Post {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

const STORAGE_KEY = "cs_blog_posts";

const loadFromStorage = (): Post[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const saveToStorage = (posts: Post[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch {}
};

const initialState: { posts: Post[] } = {
    posts: loadFromStorage(),
};

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        addPost: (state, action: PayloadAction<Omit<Post, "id" | "createdAt" | "updatedAt">>) => {
            const now = new Date().toISOString();
            const post: Post = {
                ...action.payload,
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                createdAt: now,
                updatedAt: now,
            };
            state.posts.unshift(post);
            saveToStorage(current(state).posts);
        },
        updatePost: (state, action: PayloadAction<Partial<Post> & { id: string }>) => {
            const idx = state.posts.findIndex((p) => p.id === action.payload.id);
            if (idx !== -1) {
                state.posts[idx] = {
                    ...state.posts[idx],
                    ...action.payload,
                    updatedAt: new Date().toISOString(),
                };
                saveToStorage(current(state).posts);
            }
        },
        deletePost: (state, action: PayloadAction<string>) => {
            state.posts = state.posts.filter((p) => p.id !== action.payload);
            saveToStorage(current(state).posts);
        },
    },
});

export const { addPost, updatePost, deletePost } = postsSlice.actions;
export default postsSlice;
