import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Post } from "../../Stores/postsSlice";
import { setWeeklyGoal, setMonthlyGoal } from "../../Stores/goalsSlice";
import { RootState } from "../../Stores/store-config";
import { colors, media } from "../../Styles/theme.styles";

interface Props {
    posts: Post[];
}

const Section = styled.section`
    background: var(--c-bg);
    border: 1px solid ${colors.border};
    border-radius: 12px;
    padding: 1.5rem 1.75rem;
    margin-bottom: 1.25rem;

    ${media.mobile} {
        padding: 1.25rem 1rem;
    }
`;

const Header = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 1.25rem;
`;

const Title = styled.h2`
    font-size: 0.95rem;
    font-weight: 600;
    color: ${colors.text};
`;

const Subtitle = styled.span`
    font-size: 0.78rem;
    color: ${colors.textLight};
`;

const GoalGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;

    ${media.mobile} {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
`;

const GoalCard = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
`;

const GoalHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
`;

const GoalLabel = styled.span`
    font-size: 0.8rem;
    font-weight: 600;
    color: ${colors.textMuted};
    letter-spacing: 0.02em;
`;

const GoalCount = styled.div`
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.8rem;
    color: ${colors.textMuted};
`;

const GoalValue = styled.span<{ $met: boolean; $hasGoal: boolean }>`
    font-weight: 700;
    font-size: 0.88rem;
    color: ${({ $met, $hasGoal }) =>
        !$hasGoal ? colors.textLight : $met ? "#26a641" : colors.text};
`;

const EditableGoal = styled.button`
    font-size: 0.75rem;
    color: ${colors.accent};
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-decoration: underline dotted;

    &:hover {
        color: ${colors.accentHover};
    }
`;

const InlineInput = styled.input`
    width: 52px;
    padding: 0.2rem 0.4rem;
    font-size: 0.78rem;
    border: 1px solid ${colors.accent};
    border-radius: 4px;
    background: var(--c-bg);
    color: ${colors.text};
    outline: none;
    text-align: center;
`;

const BarTrack = styled.div`
    width: 100%;
    height: 8px;
    background: ${colors.borderLight};
    border-radius: 999px;
    overflow: hidden;
`;

const BarFill = styled.div<{ $pct: number; $color: string }>`
    height: 100%;
    width: ${({ $pct }) => Math.min($pct, 100)}%;
    background: ${({ $color }) => $color};
    border-radius: 999px;
    transition: width 0.4s ease;
`;

const BarMeta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const BarPct = styled.span<{ $color: string }>`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${({ $color }) => $color};
`;

const BarHint = styled.span`
    font-size: 0.72rem;
    color: ${colors.textLight};
`;

const NoGoalHint = styled.span`
    font-size: 0.72rem;
    color: ${colors.textLight};
    font-style: italic;
`;

const getBarColor = (pct: number) => {
    if (pct >= 100) return "#26a641";
    if (pct >= 60) return "#f59e0b";
    return "#ef4444";
};

const getMotivation = (pct: number, met: boolean) => {
    if (met) return "🎉 목표 달성!";
    if (pct >= 80) return "거의 다 왔어요!";
    if (pct >= 50) return "절반 이상 달성!";
    if (pct > 0) return "계속 화이팅!";
    return "아직 시작 전이에요";
};

const StudyGoal = ({ posts }: Props) => {
    const dispatch = useDispatch();
    const { weeklyGoal, monthlyGoal } = useSelector((s: RootState) => s.goals);

    const [editingWeekly, setEditingWeekly] = useState(false);
    const [editingMonthly, setEditingMonthly] = useState(false);
    const [weeklyInput, setWeeklyInput] = useState("");
    const [monthlyInput, setMonthlyInput] = useState("");

    const { postsThisWeek, postsThisMonth } = useMemo(() => {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(now);
        monday.setDate(now.getDate() + mondayOffset);
        monday.setHours(0, 0, 0, 0);

        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const postsThisWeek = posts.filter((p) => new Date(p.createdAt) >= monday).length;
        const postsThisMonth = posts.filter((p) => new Date(p.createdAt) >= monthStart).length;

        return { postsThisWeek, postsThisMonth };
    }, [posts]);

    const weeklyPct = weeklyGoal > 0 ? Math.round((postsThisWeek / weeklyGoal) * 100) : 0;
    const monthlyPct = monthlyGoal > 0 ? Math.round((postsThisMonth / monthlyGoal) * 100) : 0;
    const weeklyMet = weeklyGoal > 0 && postsThisWeek >= weeklyGoal;
    const monthlyMet = monthlyGoal > 0 && postsThisMonth >= monthlyGoal;

    const commitWeekly = () => {
        const v = parseInt(weeklyInput, 10);
        if (!isNaN(v) && v >= 0) dispatch(setWeeklyGoal(v));
        setEditingWeekly(false);
    };

    const commitMonthly = () => {
        const v = parseInt(monthlyInput, 10);
        if (!isNaN(v) && v >= 0) dispatch(setMonthlyGoal(v));
        setEditingMonthly(false);
    };

    const handleWeeklyKey = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") commitWeekly();
        if (e.key === "Escape") setEditingWeekly(false);
    };

    const handleMonthlyKey = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") commitMonthly();
        if (e.key === "Escape") setEditingMonthly(false);
    };

    return (
        <Section>
            <Header>
                <Title>공부 목표</Title>
                <Subtitle>목표를 클릭해서 수정할 수 있어요</Subtitle>
            </Header>

            <GoalGrid>
                <GoalCard>
                    <GoalHeader>
                        <GoalLabel>이번 주</GoalLabel>
                        <GoalCount>
                            <GoalValue $met={weeklyMet} $hasGoal={weeklyGoal > 0}>
                                {postsThisWeek}
                            </GoalValue>
                            <span style={{ color: colors.textLight }}>/</span>
                            {editingWeekly ? (
                                <InlineInput
                                    type="number"
                                    min={0}
                                    max={99}
                                    autoFocus
                                    value={weeklyInput}
                                    onChange={(e) => setWeeklyInput(e.target.value)}
                                    onBlur={commitWeekly}
                                    onKeyDown={handleWeeklyKey}
                                />
                            ) : (
                                <EditableGoal
                                    onClick={() => {
                                        setWeeklyInput(weeklyGoal > 0 ? String(weeklyGoal) : "");
                                        setEditingWeekly(true);
                                    }}
                                >
                                    {weeklyGoal > 0 ? `${weeklyGoal}편` : "목표 설정"}
                                </EditableGoal>
                            )}
                        </GoalCount>
                    </GoalHeader>

                    {weeklyGoal > 0 ? (
                        <>
                            <BarTrack>
                                <BarFill $pct={weeklyPct} $color={getBarColor(weeklyPct)} />
                            </BarTrack>
                            <BarMeta>
                                <BarPct $color={getBarColor(weeklyPct)}>{weeklyPct}%</BarPct>
                                <BarHint>{getMotivation(weeklyPct, weeklyMet)}</BarHint>
                            </BarMeta>
                        </>
                    ) : (
                        <NoGoalHint>목표를 설정하면 진행률을 확인할 수 있어요</NoGoalHint>
                    )}
                </GoalCard>

                <GoalCard>
                    <GoalHeader>
                        <GoalLabel>이번 달</GoalLabel>
                        <GoalCount>
                            <GoalValue $met={monthlyMet} $hasGoal={monthlyGoal > 0}>
                                {postsThisMonth}
                            </GoalValue>
                            <span style={{ color: colors.textLight }}>/</span>
                            {editingMonthly ? (
                                <InlineInput
                                    type="number"
                                    min={0}
                                    max={999}
                                    autoFocus
                                    value={monthlyInput}
                                    onChange={(e) => setMonthlyInput(e.target.value)}
                                    onBlur={commitMonthly}
                                    onKeyDown={handleMonthlyKey}
                                />
                            ) : (
                                <EditableGoal
                                    onClick={() => {
                                        setMonthlyInput(monthlyGoal > 0 ? String(monthlyGoal) : "");
                                        setEditingMonthly(true);
                                    }}
                                >
                                    {monthlyGoal > 0 ? `${monthlyGoal}편` : "목표 설정"}
                                </EditableGoal>
                            )}
                        </GoalCount>
                    </GoalHeader>

                    {monthlyGoal > 0 ? (
                        <>
                            <BarTrack>
                                <BarFill $pct={monthlyPct} $color={getBarColor(monthlyPct)} />
                            </BarTrack>
                            <BarMeta>
                                <BarPct $color={getBarColor(monthlyPct)}>{monthlyPct}%</BarPct>
                                <BarHint>{getMotivation(monthlyPct, monthlyMet)}</BarHint>
                            </BarMeta>
                        </>
                    ) : (
                        <NoGoalHint>목표를 설정하면 진행률을 확인할 수 있어요</NoGoalHint>
                    )}
                </GoalCard>
            </GoalGrid>
        </Section>
    );
};

export default StudyGoal;
