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
    gap: 0.35rem;
    height: 120px;
    overflow-x: auto;
    padding-bottom: 4px;

    ${media.mobile} {
        gap: 0.25rem;
    }
`;

const MonthCol = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    flex: 1;
    min-width: 28px;
`;

const BarWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    height: 88px;
`;

const Bar = styled.div<{ $pct: number; $isCurrent: boolean; $delay: number }>`
    width: 100%;
    max-width: 32px;
    height: ${({ $pct }) => Math.max($pct === 0 ? 0 : 4, $pct)}%;
    background: ${({ $isCurrent }) =>
        $isCurrent
            ? "linear-gradient(180deg, #0070f3 0%, #06b6d4 100%)"
            : "var(--c-border)"};
    border-radius: 4px 4px 0 0;
    animation: ${growUp} 0.5s ease ${({ $delay }) => $delay}s both;
    transition: background 0.2s;
    position: relative;

    &:hover {
        background: ${({ $isCurrent }) =>
            $isCurrent
                ? "linear-gradient(180deg, #005ce6 0%, #0891b2 100%)"
                : colors.textLight};
    }
`;

const CountLabel = styled.span<{ $visible: boolean }>`
    font-size: 0.65rem;
    font-weight: 700;
    color: ${({ $visible }) => ($visible ? colors.textMuted : "transparent")};
    line-height: 1;
`;

const MonthLabel = styled.span<{ $isCurrent: boolean }>`
    font-size: 0.65rem;
    color: ${({ $isCurrent }) => ($isCurrent ? colors.accent : colors.textLight)};
    font-weight: ${({ $isCurrent }) => ($isCurrent ? "700" : "400")};
    white-space: nowrap;
`;

const SummaryRow = styled.div`
    display: flex;
    gap: 1.5rem;
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid ${colors.borderLight};
    flex-wrap: wrap;
`;

const Stat = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const StatValue = styled.span`
    font-size: 1.05rem;
    font-weight: 700;
    color: ${colors.text};
`;

const StatLabel = styled.span`
    font-size: 0.72rem;
    color: ${colors.textLight};
`;

const MONTHS_KR = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

const MonthlyStats = ({ posts }: Props) => {
    const { monthData, bestMonth, totalAvg, currentMonthCount } = useMemo(() => {
        const now = new Date();
        const months: { label: string; count: number; isCurrent: boolean }[] = [];

        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const year = d.getFullYear();
            const month = d.getMonth();
            const isCurrent = i === 0;

            const count = posts.filter((p) => {
                const pd = new Date(p.createdAt);
                return pd.getFullYear() === year && pd.getMonth() === month;
            }).length;

            months.push({
                label: MONTHS_KR[month],
                count,
                isCurrent,
            });
        }

        const maxCount = Math.max(...months.map((m) => m.count), 1);
        const bestMonth = months.reduce((b, m) => (m.count > b.count ? m : b), months[0]);
        const totalAvg = (posts.length / 12).toFixed(1);
        const currentMonthCount = months[months.length - 1].count;

        return {
            monthData: months.map((m) => ({
                ...m,
                pct: Math.round((m.count / maxCount) * 100),
            })),
            bestMonth,
            totalAvg,
            currentMonthCount,
        };
    }, [posts]);

    return (
        <Section>
            <Header>
                <Title>월별 학습 기록</Title>
                <Subtitle>최근 12개월</Subtitle>
            </Header>

            <ChartArea>
                {monthData.map((m, i) => (
                    <MonthCol key={i}>
                        <CountLabel $visible={m.count > 0}>{m.count}</CountLabel>
                        <BarWrapper>
                            {m.count === 0 ? (
                                <div
                                    style={{
                                        width: "100%",
                                        maxWidth: 32,
                                        height: 3,
                                        background: "var(--c-border-light)",
                                        borderRadius: 4,
                                    }}
                                />
                            ) : (
                                <Bar
                                    $pct={m.pct}
                                    $isCurrent={m.isCurrent}
                                    $delay={i * 0.03}
                                    title={`${m.label}: ${m.count}편`}
                                />
                            )}
                        </BarWrapper>
                        <MonthLabel $isCurrent={m.isCurrent}>{m.label}</MonthLabel>
                    </MonthCol>
                ))}
            </ChartArea>

            <SummaryRow>
                <Stat>
                    <StatValue>{currentMonthCount}편</StatValue>
                    <StatLabel>이번 달</StatLabel>
                </Stat>
                <Stat>
                    <StatValue>
                        {bestMonth.count > 0 ? `${bestMonth.label} (${bestMonth.count}편)` : "—"}
                    </StatValue>
                    <StatLabel>최다 기록 월</StatLabel>
                </Stat>
                <Stat>
                    <StatValue>{totalAvg}편</StatValue>
                    <StatLabel>월 평균</StatLabel>
                </Stat>
            </SummaryRow>
        </Section>
    );
};

export default MonthlyStats;
