import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Stores/store-config";
import ContributionHeatmap from "../../Components/Blog/ContributionHeatmap";
import StudyGoal from "../../Components/Blog/StudyGoal";
import TagStats from "../../Components/Blog/TagStats";
import WeekdayStats from "../../Components/Blog/WeekdayStats";
import PostCard from "../../Components/Blog/PostCard";
import { colors, media } from "../../Styles/theme.styles";

const Page = styled.main`
    max-width: 860px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 3rem;
`;

const Greeting = styled.section`
    margin-bottom: 2.5rem;
`;

const GreetingTitle = styled.h1`
    font-size: 1.6rem;
    font-weight: 700;
    color: ${colors.text};
    letter-spacing: -0.03em;
    margin-bottom: 0.4rem;

    ${media.mobile} {
        font-size: 1.35rem;
    }
`;

const GreetingDesc = styled.p`
    font-size: 0.95rem;
    color: ${colors.textMuted};
    line-height: 1.6;
    max-width: 520px;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
    margin-bottom: 1.25rem;

    ${media.tablet} {
        grid-template-columns: 1fr;
    }
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

    &:hover {
        text-decoration: underline;
    }
`;

const PostGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    ${media.tablet} {
        grid-template-columns: 1fr;
    }
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

    &:hover {
        background: ${colors.accentHover};
    }
`;

const Home = () => {
    const posts = useSelector((s: RootState) => s.posts.posts);
    const username = useSelector((s: RootState) => s.auth.username);
    const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
    const recent = posts.slice(0, 6);

    return (
        <Page>
            <Greeting>
                <GreetingTitle>
                    {isAuthenticated && username
                        ? `안녕하세요, ${username}님 👋`
                        : "CS Study Log 📚"}
                </GreetingTitle>
                <GreetingDesc>
                    CS 개념, 알고리즘, 시스템 설계 등 공부한 내용을 기록하는 개인 학습 일지입니다.
                </GreetingDesc>
            </Greeting>

            <StudyGoal posts={posts} />
            <ContributionHeatmap posts={posts} />

            <StatsGrid>
                <TagStats posts={posts} />
                <WeekdayStats posts={posts} />
            </StatsGrid>

            <section>
                <SectionHeader>
                    <SectionTitle>최근 글</SectionTitle>
                    {posts.length > 6 && <SeeAll to="/posts">전체 보기 →</SeeAll>}
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
