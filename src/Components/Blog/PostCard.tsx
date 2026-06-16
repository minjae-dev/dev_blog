import styled from "styled-components";
import { Link } from "react-router-dom";
import { Post } from "../../Stores/postsSlice";
import { colors, media, shadows } from "../../Styles/theme.styles";

interface Props {
    post: Post;
    compact?: boolean;
}

const Card = styled(Link)<{ $compact?: boolean }>`
    display: block;
    background: ${colors.bg};
    border: 1px solid ${colors.border};
    border-radius: 10px;
    padding: ${({ $compact }) => ($compact ? "1rem 1.25rem" : "1.25rem 1.5rem")};
    transition: box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease;

    &:hover {
        box-shadow: ${shadows.cardHover};
        border-color: ${colors.accent}44;
        transform: translateY(-1px);
    }
`;

const TagRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    margin-bottom: 0.6rem;
`;

const Tag = styled.span`
    font-size: 0.7rem;
    font-weight: 500;
    color: ${colors.accent};
    background: ${colors.accentLight};
    padding: 0.2em 0.6em;
    border-radius: 4px;
    letter-spacing: 0.01em;
`;

const Title = styled.h3<{ $compact?: boolean }>`
    font-size: ${({ $compact }) => ($compact ? "0.975rem" : "1.05rem")};
    font-weight: 600;
    color: ${colors.text};
    line-height: 1.4;
    margin-bottom: 0.5rem;
    letter-spacing: -0.01em;

    ${Card}:hover & {
        color: ${colors.accent};
    }
`;

const Excerpt = styled.p`
    font-size: 0.875rem;
    color: ${colors.textMuted};
    line-height: 1.6;
    margin-bottom: 0.9rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const Meta = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.78rem;
    color: ${colors.textLight};
`;

const Dot = styled.span`
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: ${colors.textLight};
`;

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const readTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
};

const PostCard = ({ post, compact }: Props) => (
    <Card to={`/post/${post.id}`} $compact={compact}>
        {post.tags.length > 0 && (
            <TagRow>
                {post.tags.slice(0, 3).map((t) => (
                    <Tag key={t}>{t}</Tag>
                ))}
            </TagRow>
        )}
        <Title $compact={compact}>{post.title}</Title>
        {!compact && post.excerpt && <Excerpt>{post.excerpt}</Excerpt>}
        <Meta>
            <span>{formatDate(post.createdAt)}</span>
            {!compact && (
                <>
                    <Dot />
                    <span>{readTime(post.content)} min read</span>
                </>
            )}
        </Meta>
    </Card>
);

export default PostCard;
