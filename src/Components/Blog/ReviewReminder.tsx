import { useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { Post } from "../../Stores/postsSlice";
import { colors } from "../../Styles/theme.styles";

interface Props {
    posts: Post[];
}

const REMIND_DAYS = 7;
const DISMISS_KEY = "cs_blog_dismissed_reminders";

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
    animation: ${slideIn} 0.3s ease;
`;

const Card = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, #fff7ed, #fef3c7);
    border: 1px solid #fde68a;
    border-radius: 10px;

    [data-theme="dark"] & {
        background: linear-gradient(135deg, #1c1400, #1a1200);
        border-color: #78350f;
    }
`;

const Left = styled.div`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    min-width: 0;
`;

const Icon = styled.span`
    font-size: 1.1rem;
    flex-shrink: 0;
`;

const Text = styled.p`
    font-size: 0.82rem;
    color: #92400e;
    line-height: 1.4;

    [data-theme="dark"] & {
        color: #fbbf24;
    }
`;

const TagChip = styled.button`
    font-size: 0.75rem;
    font-weight: 600;
    color: #b45309;
    background: #fde68a;
    border: none;
    border-radius: 4px;
    padding: 0.15em 0.5em;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
        background: #fcd34d;
    }

    [data-theme="dark"] & {
        color: #fef3c7;
        background: #78350f;
        &:hover { background: #92400e; }
    }
`;

const DismissBtn = styled.button`
    flex-shrink: 0;
    font-size: 0.75rem;
    color: #b45309;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    opacity: 0.7;
    transition: opacity 0.15s;

    &:hover { opacity: 1; }

    [data-theme="dark"] & { color: #fbbf24; }
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.4rem;
`;

const HeaderLabel = styled.span`
    font-size: 0.75rem;
    font-weight: 600;
    color: #92400e;
    display: flex;
    align-items: center;
    gap: 0.3rem;

    [data-theme="dark"] & { color: #fbbf24; }
`;

const DismissAll = styled.button`
    font-size: 0.7rem;
    color: ${colors.textLight};
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline dotted;

    &:hover { color: ${colors.textMuted}; }
`;

const loadDismissed = (): Set<string> => {
    try {
        const raw = localStorage.getItem(DISMISS_KEY);
        return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
        return new Set();
    }
};

const saveDismissed = (set: Set<string>) => {
    try {
        localStorage.setItem(DISMISS_KEY, JSON.stringify(Array.from(set)));
    } catch {}
};

const ReviewReminder = ({ posts }: Props) => {
    const navigate = useNavigate();
    const [dismissed, setDismissed] = useState<Set<string>>(loadDismissed);

    const overdue = useMemo(() => {
        if (posts.length === 0) return [];

        const tagLastUsed: Record<string, Date> = {};
        posts.forEach((p) => {
            p.tags.forEach((t) => {
                const tag = t.trim().toLowerCase();
                const d = new Date(p.createdAt);
                if (!tagLastUsed[tag] || d > tagLastUsed[tag]) {
                    tagLastUsed[tag] = d;
                }
            });
        });

        const now = new Date();
        return Object.entries(tagLastUsed)
            .map(([tag, last]) => {
                const diffDays = Math.floor((now.getTime() - last.getTime()) / 86400000);
                return { tag, diffDays, last };
            })
            .filter(({ tag, diffDays }) => diffDays >= REMIND_DAYS && !dismissed.has(tag))
            .sort((a, b) => b.diffDays - a.diffDays)
            .slice(0, 3);
    }, [posts, dismissed]);

    if (overdue.length === 0) return null;

    const dismiss = (tag: string) => {
        const next = new Set(dismissed);
        next.add(tag);
        setDismissed(next);
        saveDismissed(next);
    };

    const dismissAll = () => {
        const next = new Set(dismissed);
        overdue.forEach(({ tag }) => next.add(tag));
        setDismissed(next);
        saveDismissed(next);
    };

    return (
        <Wrapper>
            <SectionHeader>
                <HeaderLabel>🔔 복습이 필요한 태그</HeaderLabel>
                <DismissAll onClick={dismissAll}>모두 닫기</DismissAll>
            </SectionHeader>
            {overdue.map(({ tag, diffDays }) => (
                <Card key={tag}>
                    <Left>
                        <Icon>📖</Icon>
                        <Text>
                            <TagChip onClick={() => navigate(`/posts?tag=${encodeURIComponent(tag)}`)}>
                                #{tag}
                            </TagChip>{" "}
                            태그를 마지막으로 공부한 지{" "}
                            <strong>{diffDays}일</strong>이 지났어요. 복습해볼까요?
                        </Text>
                    </Left>
                    <DismissBtn onClick={() => dismiss(tag)} title="닫기">✕</DismissBtn>
                </Card>
            ))}
        </Wrapper>
    );
};

export default ReviewReminder;
