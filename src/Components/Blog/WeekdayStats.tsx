import { useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { Post } from "../../Stores/postsSlice";
import { colors, media } from "../../Styles/theme.styles";

interface Props {
    posts: Post[];
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const growUp = keyframes`
  from { height: 0%; }
`;

const Section = styled.section`
    background: var(--c-bg);
    border: 1px solid ${colors.border};
    border-radius: 12px;
    padding: 1.5rem 1.75rem;
    margin-bottom: 1.25rem;
    animation: ${fadeIn} 0.3s ease;

    ${media.mobile} {
        padding: 1.25rem 1rem;
    }
`;

const Header = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 1.5rem;
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

const ChartArea = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 0.5rem;
    height: 100px;

    ${media.mobile} {
        gap: 0.3rem;
    }
`;

const DayCol = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    flex: 1;
`;

const BarWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    height: 72px;
`;

const Bar = styled.div<{ $pct: number; $isTop: boolean; $delay: number }>`
    width: 100%;
    max-width: 36px;
    height: ${({ $pct }) => Math.max($pct, $pct === 0 ? 0 : 6)}%;
    background: ${({ $isTop }) =>
        $isTop
            ? "linear-gradient(180deg, #0070f3 0%, #06b6d4 100%)"
            : "var(--c-border)"};
    border-radius: 4px 4px 0 0;
    transition: background 0.2s;
    animation: ${growUp} 0.5s ease ${({ $delay }) => $delay}s both;
    position: relative;

    &:hover {
        background: ${({ $isTop }) =>
            $isTop ? "linear-gradient(180deg, #005ce6 0%, #0891b2 100%)" : colors.textLight};
    }
`;

const Count = styled.span<{ $visible: boolean }>`
    font-size: 0.7rem;
    font-weight: 700;
    color: ${({ $visible }) => ($visible ? colors.text : "transparent")};
`;

const DayName = styled.span<{ $isTop: boolean }>`
    font-size: 0.72rem;
    font-weight: ${({ $isTop }) => ($isTop ? "700" : "400")};
    color: ${({ $isTop }) => ($isTop ? colors.accent : colors.textMuted)};
`;

const EmptyBar = styled.div`
    width: 100%;
    max-width: 36px;
    height: 4px;
    background: var(--c-border-light);
    border-radius: 4px;
`;

const BestDayBadge = styled.div`
    margin-top: 1rem;
    padding: 0.5rem 0.85rem;
    background: ${colors.accentLight};
    border-radius: 8px;
    font-size: 0.78rem;
    color: ${colors.accent};
    font-weight: 500;
    display: inline-block;
`;

const DAYS_KR = ["일", "월", "화", "수", "목", "금", "토"];
const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const WeekdayStats = ({ posts }: Props) => {
    const { counts, maxCount, maxDay, totalPosts } = useMemo(() => {
        const counts = Array(7).fill(0);
        posts.forEach((p) => {
            const d = new Date(p.createdAt).getDay();
            counts[d]++;
        });
        const maxCount = Math.max(...counts, 1);
        const maxDay = counts.indexOf(Math.max(...counts));
        return { counts, maxCount, maxDay, totalPosts: posts.length };
    }, [posts]);

    return (
        <Section>
            <Header>
                <Title>요일별 학습 패턴</Title>
                <Subtitle>어떤 요일에 가장 열심히 공부하나요?</Subtitle>
            </Header>

            <ChartArea>
                {counts.map((count, i) => {
                    const pct = (count / maxCount) * 100;
                    const isTop = count > 0 && count === Math.max(...counts);

                    return (
                        <DayCol key={i}>
                            <Count $visible={count > 0}>{count}</Count>
                            <BarWrapper>
                                {count === 0 ? (
                                    <EmptyBar />
                                ) : (
                                    <Bar $pct={pct} $isTop={isTop} $delay={i * 0.05} />
                                )}
                            </BarWrapper>
                            <DayName $isTop={isTop}>{DAYS_KR[i]}</DayName>
                        </DayCol>
                    );
                })}
            </ChartArea>

            {totalPosts > 0 && (
                <BestDayBadge>
                    🏆 {DAYS_KR[maxDay]}요일에 가장 많이 공부해요 ({counts[maxDay]}편)
                </BestDayBadge>
            )}

            {totalPosts === 0 && (
                <BestDayBadge style={{ background: "var(--c-bg-alt)", color: colors.textLight }}>
                    글을 작성하면 패턴이 표시됩니다
                </BestDayBadge>
            )}
        </Section>
    );
};

export default WeekdayStats;
