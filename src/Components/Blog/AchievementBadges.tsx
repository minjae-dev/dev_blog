import styled from "styled-components";
import { Post } from "../../Stores/postsSlice";
import { colors } from "../../Styles/theme.styles";
import { calcStreak, calcLongestStreak } from "../../utils/streakUtils";

interface Props { posts: Post[]; }

interface Badge {
    id: string;
    emoji: string;
    label: string;
    desc: string;
    earned: boolean;
}

const Card = styled.div`
    background: var(--c-bg);
    border: 1px solid ${colors.border};
    border-radius: 14px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1.5rem;
`;

const CardTitle = styled.h3`
    font-size: 0.85rem;
    font-weight: 700;
    color: ${colors.textMuted};
    letter-spacing: 0.04em;
    margin-bottom: 1rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 0.75rem;
`;

const BadgeItem = styled.div<{ $earned: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    padding: 0.75rem 0.5rem;
    border-radius: 10px;
    border: 1px solid ${({ $earned }) => ($earned ? colors.accent + "50" : colors.border)};
    background: ${({ $earned }) => ($earned ? colors.accentLight : colors.bgAlt)};
    opacity: ${({ $earned }) => ($earned ? 1 : 0.45)};
    transition: all 0.15s;
    text-align: center;

    &:hover { transform: ${({ $earned }) => $earned ? "translateY(-1px)" : "none"}; }
`;

const BadgeEmoji = styled.div<{ $earned: boolean }>`
    font-size: 1.75rem;
    filter: ${({ $earned }) => $earned ? "none" : "grayscale(1)"};
`;

const BadgeLabel = styled.p`
    font-size: 0.72rem;
    font-weight: 600;
    color: ${colors.text};
    line-height: 1.3;
`;

const BadgeDesc = styled.p`
    font-size: 0.65rem;
    color: ${colors.textMuted};
    line-height: 1.3;
`;

const EarnedCount = styled.span`
    font-size: 0.75rem;
    color: ${colors.textLight};
`;

const AchievementBadges = ({ posts }: Props) => {
    const count = posts.length;
    const streak = calcStreak(posts);
    const longestStreak = calcLongestStreak(posts);
    const tagCount = new Set(posts.flatMap((p) => p.tags)).size;
    const thisWeek = posts.filter((p) => {
        const d = new Date(p.createdAt);
        const now = new Date();
        const diff = (now.getTime() - d.getTime()) / 86400000;
        return diff <= 7;
    }).length;

    const badges: Badge[] = [
        {
            id: "first",
            emoji: "🌱",
            label: "첫 발걸음",
            desc: "첫 글 작성",
            earned: count >= 1,
        },
        {
            id: "ten",
            emoji: "📚",
            label: "학습자",
            desc: "글 10개 작성",
            earned: count >= 10,
        },
        {
            id: "fifty",
            emoji: "🏆",
            label: "지식인",
            desc: "글 50개 작성",
            earned: count >= 50,
        },
        {
            id: "hundred",
            emoji: "💎",
            label: "마스터",
            desc: "글 100개 작성",
            earned: count >= 100,
        },
        {
            id: "streak3",
            emoji: "🔥",
            label: "연속 3일",
            desc: "3일 연속 학습",
            earned: streak >= 3,
        },
        {
            id: "streak7",
            emoji: "⚡",
            label: "주간 스트릭",
            desc: "7일 연속 학습",
            earned: streak >= 7,
        },
        {
            id: "streak30",
            emoji: "🌟",
            label: "한 달 스트릭",
            desc: "30일 연속 학습",
            earned: longestStreak >= 30,
        },
        {
            id: "week5",
            emoji: "🚀",
            label: "이번 주 스타",
            desc: "이번 주 글 5개",
            earned: thisWeek >= 5,
        },
        {
            id: "tags5",
            emoji: "🏷️",
            label: "다양한 관심사",
            desc: "태그 5개 이상",
            earned: tagCount >= 5,
        },
        {
            id: "tags10",
            emoji: "🗺️",
            label: "탐험가",
            desc: "태그 10개 이상",
            earned: tagCount >= 10,
        },
        {
            id: "tags20",
            emoji: "🌍",
            label: "CS 전문가",
            desc: "태그 20개 이상",
            earned: tagCount >= 20,
        },
        {
            id: "long",
            emoji: "✍️",
            label: "긴 호흡",
            desc: "1000자 이상 글",
            earned: posts.some((p) => p.content.length >= 1000),
        },
    ];

    const earnedCount = badges.filter((b) => b.earned).length;

    return (
        <Card>
            <CardTitle>
                🏅 업적 배지{" "}
                <EarnedCount>({earnedCount}/{badges.length} 획득)</EarnedCount>
            </CardTitle>
            <Grid>
                {badges.map((b) => (
                    <BadgeItem key={b.id} $earned={b.earned}>
                        <BadgeEmoji $earned={b.earned}>{b.emoji}</BadgeEmoji>
                        <BadgeLabel>{b.label}</BadgeLabel>
                        <BadgeDesc>{b.desc}</BadgeDesc>
                    </BadgeItem>
                ))}
            </Grid>
        </Card>
    );
};

export default AchievementBadges;
