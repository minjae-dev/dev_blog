import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GoalsState {
    weeklyGoal: number;
    monthlyGoal: number;
}

const GOALS_KEY = "cs_blog_goals";

const loadGoals = (): GoalsState => {
    try {
        const raw = localStorage.getItem(GOALS_KEY);
        if (!raw) return { weeklyGoal: 0, monthlyGoal: 0 };
        return JSON.parse(raw);
    } catch {
        return { weeklyGoal: 0, monthlyGoal: 0 };
    }
};

const saveGoals = (state: GoalsState) => {
    try {
        localStorage.setItem(GOALS_KEY, JSON.stringify(state));
    } catch {}
};

const goalsSlice = createSlice({
    name: "goals",
    initialState: loadGoals(),
    reducers: {
        setWeeklyGoal: (state, action: PayloadAction<number>) => {
            state.weeklyGoal = action.payload;
            saveGoals({ weeklyGoal: action.payload, monthlyGoal: state.monthlyGoal });
        },
        setMonthlyGoal: (state, action: PayloadAction<number>) => {
            state.monthlyGoal = action.payload;
            saveGoals({ weeklyGoal: state.weeklyGoal, monthlyGoal: action.payload });
        },
    },
});

export const { setWeeklyGoal, setMonthlyGoal } = goalsSlice.actions;
export default goalsSlice;
