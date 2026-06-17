import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { RootState } from "../../Stores/store-config";
import ContributionHeatmap from "../../Components/Blog/ContributionHeatmap";
import PomodoroTimer from "../../Components/Blog/PomodoroTimer";
import RecentActivity from "../../Components/Blog/RecentActivity";
import StudyGoal from "../../Components/Blog/StudyGoal";
import StudyQuote from "../../Components/Blog/StudyQuote";
import AchievementBadges from "../../Components/Blog/AchievementBadges";
import TagStats from "../../Components/Blog/TagStats";
import WeekdayStats from "../../Components/Blog/WeekdayStats";
import MonthlyStats from "../../Components/Blog/MonthlyStats";
import ReviewReminder from "../../Components/Blog/ReviewReminder";
import PostCard from "../../Components/Blog/PostCard";
import { colors, media } from "../../Styles/theme.styles";
import { calcStreak, calcThisWeek, calcLongestStreak } from "../../utils/streakUtils";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Page = styled.main`
    max-width: 860px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 3rem;
    animation: ${fadeUp} 0.3s ease;
`;

const Greeting = styled.section`
    margin-bottom: 1.75rem;
`;

const GreetingTitle = styled.h1`
    font-size: 1.6rem;
    font-weight: 700;
    color: ${colors.text};
    letter-spacing: -0.03em;
    margin-bottom: 0.4rem;

    ${media.mobile} { font-size: 1.35rem; }
`;

const GreetingDesc = styled.p`
    font-size: 0.95rem;
    color: ${colors.textMuted};
    line-height: 1.6;
    max-width: 520px;
`;

const QuickStats = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
    margin-bottom: 2rem;

    ${media.tablet} { grid-template-columns: repeat(2, 1fr); }
    ${media.mobile} { grid-template-columns: repeat(2, 1fr); }
`;

const StatCard = styled.div<{ $accent?: boolean }>`
    background: ${({ $accent }) => ($accent ? colors.accentLight : "var(--c-bg)")};
    border: 1px solid ${({ $accent }) => ($accent ? `${colors.accent}44` : colors.border)};
    border-radius: 10px;
    padding: 0.9rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    transition: border-color 0.15s, transform 0.15s;

    &:hover {
        border-color: ${colors.accent}66;
        transform: translateY(-1px);
    }
`;

const StatNum = styled.div<{ $accent?: boolean }>`
    font-size: 1.6rem;
    font-weight: 700;
    color: ${({ $accent }) => ($accent ? colors.accent : colors.text)};
    letter-spacing: -0.03em;
    line-height: 1;
`;

const StatLabel = styled.div`
    font-size: 0.72rem;
    color: ${colors.textMuted};
    font-weight: 500;
`;

const StatSub = styled.div`
    font-size: 0.68rem;
    color: ${colors.textLight};
    margin-top: 0.1rem;
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
    font-size: 1rem;
    font-weight: 600;
    color: ${colors.text};
`;

const SeeAll = styled(Link)`
    font-size: 0.8rem;
    color: ${colors.accent};
    font-weight: 500;

    &:hover { text-decoration: underline; }
`;

const StatsRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;

    ${media.tablet} { grid-template-columns: 1fr; }
`;

const PostGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    ${media.tablet} { grid-template-columns: 1fr; }
`;

const TagCloud = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    padding: 1rem;
    background: var(--c-bg);
    border: 1px solid ${colors.border};
    border-radius: 10px;
    margin-bottom: 2rem;
`;

const CloudTag = styled(Link)<{ $size: number }>`
    font-size: ${({ $size }) => 0.72 + $size * 0.08}rem;
    font-weight: ${({ $size }) => 400 + $size * 50};
    color: ${({ $size }) => $size > 3 ? colors.accent : colors.textMuted};
    padding: 0.15em 0.45em;
    border-radius: 4px;
    transition: color 0.12s;

    &:hover { color: ${colors.accent}; text-decoration: underline; }
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 3rem 1.5rem;
    border: 1px dashed ${colors.border};
    border-radius: 12px;
    color: ${colors.textMuted};
`;

const EmptyIcon = styled.div`
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
`;

const EmptyTitle = styled.p`
    font-size: 1rem;
    font-weight: 600;
    color: ${colors.text};
    margin-bottom: 0.5rem;
`;

const EmptyDesc = styled.p`
    font-size: 0.875rem;
    margin-bottom: 1.25rem;
`;

const StartBtn = styled(Link)`
    display: inline-block;
    padding: 0.55rem 1.25rem;
    background: ${colors.accent};
    color: #fff;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background 0.15s;

    &:hover { background: ${colors.accentHover}; }
`;

const getGreetingTime = () => {
    const h = new Date().getHours();
    if (h < 6) return "새벽에도 공부 중이시군요 🌙";
    if (h < 12) return "좋은 아침이에요 ☀️";
    if (h < 18) return "좋은 오후에요 🌤";
    return "좋은 저녁이에요 🌆";
};

const Home = () => {
    const posts = useSelector((s: RootState) => s.posts.posts);
    const username = useSelector((s: RootState) => s.auth.username);
    const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
    const bookmarkCount = useSelector((s: RootState) => s.bookmarks.ids.length);

    const pinned = posts.filter((p) => p.pinned);
    const recent = posts.filter((p) => !p.pinned).slice(0, 6);

    const streak = useMemo(() => calcStreak(posts), [posts]);
    const thisWeek = useMemo(() => calcThisWeek(posts), [posts]);
    const longest = useMemo(() => calcLongestStreak(posts), [posts]);

    const allTags = useMemo(() => {
        const s = new Set<string>();
        posts.forEach((p) => p.tags.forEach((t) => s.add(t)));
        return s.size;
    }, [posts]);

    const topTags = useMemo(() => {
        const count: Record<string, number> = {};
        posts.forEach((p) => p.tags.forEach((t) => { count[t] = (count[t] || 0) + 1; }));
        return Object.entries(count)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 16);
    }, [posts]);

    const randomPost = useMemo(() => {
        if (posts.length < 3) return null;
        return posts[Math.floor(Math.random() * posts.length)];
    }, [posts.length]);

    return (
        <Page>
            <Greeting>
                <GreetingTitle>
                    {isAuthenticated && username
                        ? `${username}님, ${getGreetingTime()}`
                        : "CS Study Log 📚"}
                </GreetingTitle>
                <GreetingDesc>
                    CS 개념, 알고리즘, 시스템 설계 등 공부한 내용을 기록하는 개인 학습 일지입니다.
                </GreetingDesc>
            </Greeting>

            {posts.length > 0 && (
                <QuickStats>
                    <StatCard as={Link} to="/posts" style={{ textDecoration: "none", cursor: "pointer" }}>
                        <StatNum>{posts.length}</StatNum>
                        <StatLabel>전체 글</StatLabel>
                        <StatSub>{allTags}개 태그</StatSub>
                    </StatCard>
                    <StatCard $accent={streak > 0}>
                        <StatNum $accent={streak > 0}>{streak > 0 ? `${streak}일` : "0"}</StatNum>
                        <StatLabel>연속 학습</StatLabel>
                        <StatSub>최장 {longest}일</StatSub>
                    </StatCard>
                    <StatCard>
                        <StatNum>{thisWeek}</StatNum>
                        <StatLabel>이번 주</StatLabel>
                        <StatSub>월요일부터</StatSub>
                    </StatCard>
                    <StatCard as={Link} to="/posts?bookmarks=1" style={{ textDecoration: "none", cursor: "pointer" }}>
                        <StatNum>{bookmarkCount}</StatNum>
                        <StatLabel>즐겨찾기</StatLabel>
                        <StatSub>★ 저장된 글</StatSub>
                    </StatCard>
                </QuickStats>
            )}

            <StudyQuote />
            <ReviewReminder posts={posts} />
            <PomodoroTimer />
            <StudyGoal posts={posts} />
            <RecentActivity posts={posts} />
            <ContributionHeatmap posts={posts} />
            <MonthlyStats posts={posts} />

            <AchievementBadges posts={posts} />

            {topTags.length > 0 && (
                <section style={{ marginBottom: "2rem" }}>
                    <SectionHeader>
                        <SectionTitle>🏷️ 태그 클라우드</SectionTitle>
                        <SeeAll to="/posts">모든 글 보기 →</SeeAll>
                    </SectionHeader>
                    <TagCloud>
                        {topTags.map(([tag, count]) => (
                            <CloudTag
                                key={tag}
                                to={`/posts?tag=${encodeURIComponent(tag)}`}
                                $size={Math.min(count, 8)}
                                title={`${count}개 글`}
                            >
                                #{tag}
                            </CloudTag>
                        ))}
                    </TagCloud>
                </section>
            )}

            <StatsRow>
                <TagStats posts={posts} />
                <WeekdayStats posts={posts} />
            </StatsRow>

            {pinned.length > 0 && (
                <section style={{ marginBottom: "2rem" }}>
                    <SectionHeader>
                        <SectionTitle>📌 고정된 글</SectionTitle>
                    </SectionHeader>
                    <PostGrid>
                        {pinned.map((p) => (
                            <PostCard key={p.id} post={p} />
                        ))}
                    </PostGrid>
                </section>
            )}

            <section>
                <SectionHeader>
                    <SectionTitle>최근 글</SectionTitle>
                    {posts.filter((p) => !p.pinned).length > 6 && <SeeAll to="/posts">전체 보기 →</SeeAll>}
                </SectionHeader>

                {posts.length === 0 ? (
                    <EmptyState>
                        <EmptyIcon>✍️</EmptyIcon>
                        <EmptyTitle>아직 작성된 글이 없어요</EmptyTitle>
                        <EmptyDesc>
                            CS 공부 내용을 기록하며 학습 흐름을 추적해보세요.
                        </EmptyDesc>
                        <StartBtn to={isAuthenticated ? "/write" : "/login"}>
                            {isAuthenticated ? "첫 글 작성하기" : "로그인하고 시작하기"}
                        </StartBtn>
                    </EmptyState>
                ) : (
                    <PostGrid>
                        {recent.map((p) => (
                            <PostCard key={p.id} post={p} />
                        ))}
                    </PostGrid>
                )}
            </section>
        </Page>
    );
};

export default Home;
