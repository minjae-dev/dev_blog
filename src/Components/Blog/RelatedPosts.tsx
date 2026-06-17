import styled from "styled-components";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Post } from "../../Stores/postsSlice";
import { colors } from "../../Styles/theme.styles";

interface Props {
    currentPost: Post;
    allPosts: Post[];
}

const Section = styled.section`
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid ${colors.border};
`;

const Title = styled.h3`
    font-size: 0.85rem;
    font-weight: 700;
    color: ${colors.textMuted};
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 1rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
`;

const Card = styled(Link)`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 0.9rem 1rem;
    border: 1px solid ${colors.border};
    border-radius: 10px;
    background: var(--c-bg);
    transition: all 0.15s;

    &:hover {
        border-color: ${colors.accent};
        box-shadow: 0 2px 12px rgba(0, 112, 243, 0.08);
        transform: translateY(-1px);
    }
`;

const CardTags = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
`;

const Tag = styled.span`
    font-size: 0.65rem;
    font-weight: 500;
    color: ${colors.accent};
    background: ${colors.accentLight};
    padding: 0.1em 0.4em;
    border-radius: 3px;
`;

const CardTitle = styled.p`
    font-size: 0.82rem;
    font-weight: 600;
    color: ${colors.text};
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const CardDate = styled.span`
    font-size: 0.68rem;
    color: ${colors.textLight};
    margin-top: auto;
`;

const SharedTags = styled.span`
    font-size: 0.68rem;
    color: ${colors.accent};
    font-weight: 500;
`;

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ko-KR", { month: "short", day: "numeric" });

const RelatedPosts = ({ currentPost, allPosts }: Props) => {
    const related = useMemo(() => {
        const currentTags = new Set(currentPost.tags.map((t) => t.toLowerCase()));

        return allPosts
            .filter((p) => p.id !== currentPost.id)
            .map((p) => {
                const shared = p.tags.filter((t) => currentTags.has(t.toLowerCase())).length;
                return { post: p, shared };
            })
            .filter(({ shared }) => shared > 0)
            .sort((a, b) => b.shared - a.shared || new Date(b.post.createdAt).getTime() - new Date(a.post.createdAt).getTime())
            .slice(0, 3);
    }, [currentPost, allPosts]);

    if (related.length === 0) return null;

    return (
        <Section>
            <Title>관련 글</Title>
            <Grid>
                {related.map(({ post, shared }) => (
                    <Card key={post.id} to={`/post/${post.id}`}>
                        {post.tags.length > 0 && (
                            <CardTags>
                                {post.tags.slice(0, 2).map((t) => (
                                    <Tag key={t}>#{t}</Tag>
                                ))}
                            </CardTags>
                        )}
                        <CardTitle>{post.title}</CardTitle>
                        <CardDate>{formatDate(post.createdAt)}</CardDate>
                        <SharedTags>태그 {shared}개 공통</SharedTags>
                    </Card>
                ))}
            </Grid>
        </Section>
    );
};

export default RelatedPosts;
