import styled from "styled-components";
import { useMemo } from "react";
import { Post } from "../../Stores/postsSlice";
import { colors, media } from "../../Styles/theme.styles";

interface Props {
    posts: Post[];
}

const WEEKS = 52;
const DAYS = 7;

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getLevelColor = (count: number) => {
    if (count === 0) return colors.heatmap.empty;
    if (count === 1) return colors.heatmap.l1;
    if (count === 2) return colors.heatmap.l2;
    if (count === 3) return colors.heatmap.l3;
    return colors.heatmap.l4;
};

const toDateKey = (d: Date) => d.toISOString().slice(0, 10);

const Section = styled.section`
    background: ${colors.bg};
    border: 1px solid ${colors.border};
    border-radius: 12px;
    padding: 1.5rem 1.75rem;
    margin-bottom: 2.5rem;
`;

const Header = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 1.25rem;

    ${media.mobile} {
        flex-direction: column;
        gap: 0.25rem;
    }
`;

const Title = styled.h2`
    font-size: 0.95rem;
    font-weight: 600;
    color: ${colors.text};
`;

const Subtitle = styled.span`
    font-size: 0.8rem;
    color: ${colors.textLight};
`;

const ScrollWrapper = styled.div`
    overflow-x: auto;
    padding-bottom: 4px;
`;

const Grid = styled.div`
    display: inline-flex;
    flex-direction: column;
    gap: 0;
    min-width: max-content;
`;

const MonthRow = styled.div`
    display: flex;
    margin-left: 26px;
    margin-bottom: 4px;
`;

const MonthLabel = styled.span<{ $width: number }>`
    font-size: 0.7rem;
    color: ${colors.textLight};
    width: ${({ $width }) => $width}px;
    display: inline-block;
`;

const WeeksAndDays = styled.div`
    display: flex;
    gap: 0;
`;

const DayLabels = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-right: 4px;
    padding-top: 2px;
`;

const DayLabel = styled.span<{ $show: boolean }>`
    font-size: 0.65rem;
    color: ${({ $show }) => ($show ? colors.textLight : "transparent")};
    height: 11px;
    line-height: 11px;
    width: 22px;
    text-align: right;
    padding-right: 4px;
`;

const WeeksGrid = styled.div`
    display: flex;
    gap: 2px;
`;

const WeekCol = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const Cell = styled.div<{ $color: string; $hasData: boolean }>`
    width: 11px;
    height: 11px;
    border-radius: 2px;
    background: ${({ $color }) => $color};
    cursor: ${({ $hasData }) => ($hasData ? "pointer" : "default")};
    transition: opacity 0.1s;
    position: relative;

    &:hover {
        opacity: ${({ $hasData }) => ($hasData ? "0.8" : "1")};
    }
`;

const Legend = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    justify-content: flex-end;
    margin-top: 0.75rem;
`;

const LegendLabel = styled.span`
    font-size: 0.7rem;
    color: ${colors.textLight};
`;

const LegendCell = styled.div<{ $color: string }>`
    width: 11px;
    height: 11px;
    border-radius: 2px;
    background: ${({ $color }) => $color};
`;

const Stats = styled.div`
    display: flex;
    gap: 1.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid ${colors.borderLight};

    ${media.mobile} {
        gap: 1rem;
    }
`;

const Stat = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const StatValue = styled.span`
    font-size: 1.15rem;
    font-weight: 700;
    color: ${colors.text};
`;

const StatLabel = styled.span`
    font-size: 0.75rem;
    color: ${colors.textLight};
`;

const ContributionHeatmap = ({ posts }: Props) => {
    const { grid, monthLabels, totalThisYear, currentStreak, maxDay } = useMemo(() => {
        const counts: Record<string, number> = {};
        posts.forEach((p) => {
            const key = p.createdAt.slice(0, 10);
            counts[key] = (counts[key] || 0) + 1;
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDay = new Date(today);
        startDay.setDate(today.getDate() - WEEKS * DAYS + 1);
        const dayOffset = startDay.getDay();
        startDay.setDate(startDay.getDate() - dayOffset);

        const weeks: Array<Array<{ date: Date; count: number } | null>> = [];
        const cur = new Date(startDay);

        for (let w = 0; w < WEEKS + 1; w++) {
            const week: Array<{ date: Date; count: number } | null> = [];
            for (let d = 0; d < DAYS; d++) {
                const cell = new Date(cur);
                const key = toDateKey(cell);
                if (cell > today) {
                    week.push(null);
                } else {
                    week.push({ date: cell, count: counts[key] || 0 });
                }
                cur.setDate(cur.getDate() + 1);
            }
            weeks.push(week);
        }

        const monthLabels: { label: string; col: number }[] = [];
        let lastMonth = -1;
        weeks.forEach((week, wi) => {
            const firstReal = week.find((c) => c !== null);
            if (firstReal) {
                const m = firstReal.date.getMonth();
                if (m !== lastMonth) {
                    monthLabels.push({ label: MONTH_ABBR[m], col: wi });
                    lastMonth = m;
                }
            }
        });

        const yearStart = new Date(today.getFullYear(), 0, 1).toISOString().slice(0, 10);
        const totalThisYear = Object.entries(counts).filter(([k]) => k >= yearStart).reduce((s, [, v]) => s + v, 0);

        let currentStreak = 0;
        const check = new Date(today);
        while (true) {
            const key = toDateKey(check);
            if (counts[key] && counts[key] > 0) {
                currentStreak++;
                check.setDate(check.getDate() - 1);
            } else {
                break;
            }
        }

        const maxDay = Math.max(...Object.values(counts), 0);

        return { grid: weeks, monthLabels, totalThisYear, currentStreak, maxDay };
    }, [posts]);

    const CELL_W = 11 + 2;

    return (
        <Section>
            <Header>
                <Title>Contribution Activity</Title>
                <Subtitle>{totalThisYear} posts this year</Subtitle>
            </Header>
            <ScrollWrapper>
                <Grid>
                    <MonthRow>
                        {monthLabels.map((ml, i) => {
                            const nextCol = monthLabels[i + 1]?.col ?? grid.length;
                            const width = (nextCol - ml.col) * CELL_W;
                            return (
                                <MonthLabel key={ml.col} $width={width}>
                                    {ml.label}
                                </MonthLabel>
                            );
                        })}
                    </MonthRow>
                    <WeeksAndDays>
                        <DayLabels>
                            {DAY_LABELS.map((d, i) => (
                                <DayLabel key={d} $show={i % 2 === 1}>
                                    {d}
                                </DayLabel>
                            ))}
                        </DayLabels>
                        <WeeksGrid>
                            {grid.map((week, wi) => (
                                <WeekCol key={wi}>
                                    {week.map((cell, di) =>
                                        cell === null ? (
                                            <Cell key={di} $color="transparent" $hasData={false} />
                                        ) : (
                                            <Cell
                                                key={di}
                                                $color={getLevelColor(cell.count)}
                                                $hasData={cell.count > 0}
                                                title={`${toDateKey(cell.date)}: ${cell.count} post${cell.count !== 1 ? "s" : ""}`}
                                            />
                                        )
                                    )}
                                </WeekCol>
                            ))}
                        </WeeksGrid>
                    </WeeksAndDays>
                </Grid>
            </ScrollWrapper>
            <Legend>
                <LegendLabel>Less</LegendLabel>
                <LegendCell $color={colors.heatmap.empty} />
                <LegendCell $color={colors.heatmap.l1} />
                <LegendCell $color={colors.heatmap.l2} />
                <LegendCell $color={colors.heatmap.l3} />
                <LegendCell $color={colors.heatmap.l4} />
                <LegendLabel>More</LegendLabel>
            </Legend>
            <Stats>
                <Stat>
                    <StatValue>{posts.length}</StatValue>
                    <StatLabel>Total posts</StatLabel>
                </Stat>
                <Stat>
                    <StatValue>{totalThisYear}</StatValue>
                    <StatLabel>This year</StatLabel>
                </Stat>
                <Stat>
                    <StatValue>{currentStreak}</StatValue>
                    <StatLabel>Day streak</StatLabel>
                </Stat>
                <Stat>
                    <StatValue>{maxDay}</StatValue>
                    <StatLabel>Best day</StatLabel>
                </Stat>
            </Stats>
        </Section>
    );
};

export default ContributionHeatmap;
