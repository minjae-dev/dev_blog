import { Post } from "../Stores/postsSlice";

export const calcStreak = (posts: Post[]): number => {
    if (posts.length === 0) return 0;

    const days = new Set(
        posts.map((p) => new Date(p.createdAt).toLocaleDateString("ko-KR"))
    );

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString("ko-KR");
        if (days.has(label)) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
};

export const calcThisWeek = (posts: Post[]): number => {
    const monday = new Date();
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    return posts.filter((p) => new Date(p.createdAt) >= monday).length;
};

export const calcLongestStreak = (posts: Post[]): number => {
    if (posts.length === 0) return 0;

    const days = Array.from(
        new Set(posts.map((p) => new Date(p.createdAt).toLocaleDateString("ko-KR")))
    )
        .map((d) => new Date(d).getTime())
        .sort((a, b) => a - b);

    let max = 1;
    let cur = 1;
    const DAY = 86400000;

    for (let i = 1; i < days.length; i++) {
        const diff = days[i] - days[i - 1];
        if (diff <= DAY + 1000) {
            cur++;
            max = Math.max(max, cur);
        } else {
            cur = 1;
        }
    }

    return max;
};
