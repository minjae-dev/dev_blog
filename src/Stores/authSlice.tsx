import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    isSetup: boolean;
    username: string;
    isAuthenticated: boolean;
}

const AUTH_KEY = "cs_blog_auth";

const loadAuth = (): AuthState => {
    try {
        const raw = localStorage.getItem(AUTH_KEY);
        if (!raw) return { isSetup: false, username: "", isAuthenticated: false };
        const saved = JSON.parse(raw);
        return {
            isSetup: saved.isSetup ?? false,
            username: saved.username ?? "",
            isAuthenticated: saved.isAuthenticated ?? false,
        };
    } catch {
        return { isSetup: false, username: "", isAuthenticated: false };
    }
};

const saveAuth = (state: AuthState) => {
    try {
        localStorage.setItem(AUTH_KEY, JSON.stringify(state));
    } catch {}
};

const initialState: AuthState = loadAuth();

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setup: (state, action: PayloadAction<{ username: string; password: string }>) => {
            localStorage.setItem("cs_blog_pw", action.payload.password);
            state.isSetup = true;
            state.username = action.payload.username;
            state.isAuthenticated = true;
            saveAuth({ isSetup: true, username: action.payload.username, isAuthenticated: true });
        },
        login: (state, action: PayloadAction<{ password: string }>) => {
            const stored = localStorage.getItem("cs_blog_pw") ?? "";
            if (action.payload.password === stored) {
                state.isAuthenticated = true;
                saveAuth({ isSetup: state.isSetup, username: state.username, isAuthenticated: true });
                return;
            }
        },
        logout: (state) => {
            state.isAuthenticated = false;
            saveAuth({ isSetup: state.isSetup, username: state.username, isAuthenticated: false });
        },
    },
});

export const { setup, login, logout } = authSlice.actions;
export default authSlice;
