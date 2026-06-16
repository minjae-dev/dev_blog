import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Stores/store-config";
import ContributionHeatmap from "../../Components/Blog/ContributionHeatmap";
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
    const recent = posts.slice(0, 6);

    return (
        <Page>
            <Greeting>
                <GreetingTitle>CS Study Log 📚</GreetingTitle>
                <GreetingDesc>
                    A personal journal for tracking computer science concepts, algorithms, system design, and anything else worth remembering.
                </GreetingDesc>
            </Greeting>

            <ContributionHeatmap posts={posts} />

            <section>
                <SectionHeader>
                    <SectionTitle>Recent Posts</SectionTitle>
                    {posts.length > 6 && <SeeAll to="/posts">See all →</SeeAll>}
                </SectionHeader>

                {posts.length === 0 ? (
                    <EmptyState>
                        <EmptyIcon>✍️</EmptyIcon>
                        <EmptyTitle>No posts yet</EmptyTitle>
                        <EmptyDesc>Start logging your CS studies to track your progress.</EmptyDesc>
                        <StartBtn to="/write">Write your first post</StartBtn>
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
