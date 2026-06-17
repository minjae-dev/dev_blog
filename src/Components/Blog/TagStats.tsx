import { useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { Post } from "../../Stores/postsSlice";
import { colors, media } from "../../Styles/theme.styles";

interface Props {
    posts: Post[];
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const growBar = keyframes`
  from { width: 0%; }
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
    margin-bottom: 1.25rem;
    gap: 0.5rem;
    flex-wrap: wrap;
`;

const Title = styled.h2`
    font-size: 0.95rem;
    font-weight: 600;
    color: ${colors.text};
`;

const Controls = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const TabBtn = styled.button<{ $active: boolean }>`
    font-size: 0.73rem;
    font-weight: ${({ $active }) => ($active ? "600" : "400")};
    padding: 0.25rem 0.65rem;
    border-radius: 20px;
    border: 1px solid ${({ $active }) => ($active ? colors.accent : colors.border)};
    background: ${({ $active }) => ($active ? colors.accentLight : "transparent")};
    color: ${({ $active }) => ($active ? colors.accent : colors.textMuted)};
    transition: all 0.15s;
    cursor: pointer;

    &:hover {
        border-color: ${colors.accent};
        color: ${colors.accent};
    }
`;

const TotalBadge = styled.span`
    font-size: 0.73rem;
    color: ${colors.textLight};
`;

const EmptyMsg = styled.p`
    font-size: 0.875rem;
    color: ${colors.textLight};
    text-align: center;
    padding: 1.5rem 0;
`;

const BarList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
`;

const BarRow = styled.div`
    display: grid;
    grid-template-columns: 110px 1fr 36px;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;

    ${media.mobile} {
        grid-template-columns: 90px 1fr 30px;
        gap: 0.5rem;
    }

    &:hover span[data-label] {
        color: ${colors.accent};
    }
`;

const TagLabel = styled.span`
    font-size: 0.78rem;
    font-weight: 500;
    color: ${colors.textMuted};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.15s;
`;

const Track = styled.div`
    height: 10px;
    background: ${colors.borderLight};
    border-radius: 999px;
    overflow: hidden;
`;

const Fill = styled.div<{ $pct: number; $color: string; $delay: number }>`
    height: 100%;
    width: ${({ $pct }) => $pct}%;
    background: ${({ $color }) => $color};
    border-radius: 999px;
    animation: ${growBar} 0.5s ease ${({ $delay }) => $delay}s both;
`;

const CountLabel = styled.span`
    font-size: 0.75rem;
    font-weight: 700;
    color: ${colors.textMuted};
    text-align: right;
`;

const TopBadge = styled.span`
    font-size: 0.62rem;
    font-weight: 600;
    background: linear-gradient(135deg, #f59e0b, #ef4444);
    color: #fff;
    padding: 0.1em 0.45em;
    border-radius: 4px;
    margin-left: 0.35rem;
    vertical-align: middle;
`;

const BAR_COLORS = [
    "#0070f3",
    "#06b6d4",
    "#8b5cf6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
    "#6366f1",
    "#14b8a6",
    "#f97316",
];

const TagStats = ({ posts }: Props) => {
    const navigate = useNavigate();
    const [showAll, setShowAll] = useState(false);
    const [sortBy, setSortBy] = useState<"count" | "alpha">("count");

    const { tagData, uniqueCount, totalTagUses } = useMemo(() => {
        const counts: Record<string, number> = {};
        posts.forEach((p) => {
            p.tags.forEach((t) => {
                const key = t.trim().toLowerCase();
                if (key) counts[key] = (counts[key] || 0) + 1;
            });
        });

        const entries = Object.entries(counts);
        const uniqueCount = entries.length;
        const totalTagUses = entries.reduce((s, [, v]) => s + v, 0);

        const sorted =
            sortBy === "count"
                ? entries.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
                : entries.sort((a, b) => a[0].localeCompare(b[0]));

        return {
            tagData: sorted,
            uniqueCount,
            totalTagUses,
        };
    }, [posts, sortBy]);

    const visible = showAll ? tagData : tagData.slice(0, 8);
    const maxCount = tagData[0]?.[1] ?? 1;

    const handleTagClick = (tag: string) => {
        navigate(`/posts?tag=${encodeURIComponent(tag)}`);
    };

    return (
        <Section>
            <Header>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Title>태그별 학습 통계</Title>
                    <TotalBadge>
                        태그 {uniqueCount}개 · {totalTagUses}회 사용
                    </TotalBadge>
                </div>
                <Controls>
                    <TabBtn $active={sortBy === "count"} onClick={() => setSortBy("count")}>
                        많은 순
                    </TabBtn>
                    <TabBtn $active={sortBy === "alpha"} onClick={() => setSortBy("alpha")}>
                        가나다 순
                    </TabBtn>
                </Controls>
            </Header>

            {tagData.length === 0 ? (
                <EmptyMsg>태그가 있는 글을 작성하면 통계가 표시됩니다</EmptyMsg>
            ) : (
                <>
                    <BarList>
                        {visible.map(([tag, count], i) => {
                            const pct = Math.max(4, Math.round((count / maxCount) * 100));
                            const color = BAR_COLORS[i % BAR_COLORS.length];
                            const isTop = sortBy === "count" && i === 0;

                            return (
                                <BarRow
                                    key={tag}
                                    onClick={() => handleTagClick(tag)}
                                    title={`"${tag}" 태그 글 보기`}
                                >
                                    <TagLabel data-label>
                                        #{tag}
                                        {isTop && <TopBadge>TOP</TopBadge>}
                                    </TagLabel>
                                    <Track>
                                        <Fill $pct={pct} $color={color} $delay={i * 0.04} />
                                    </Track>
                                    <CountLabel>{count}</CountLabel>
                                </BarRow>
                            );
                        })}
                    </BarList>

                    {tagData.length > 8 && (
                        <button
                            onClick={() => setShowAll((v) => !v)}
                            style={{
                                marginTop: "1rem",
                                fontSize: "0.78rem",
                                color: colors.accent,
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                                textDecoration: "underline dotted",
                            }}
                        >
                            {showAll
                                ? "접기 ↑"
                                : `나머지 ${tagData.length - 8}개 태그 더 보기 ↓`}
                        </button>
                    )}
                </>
            )}
        </Section>
    );
};

export default TagStats;
