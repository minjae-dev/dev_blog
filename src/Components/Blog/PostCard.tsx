import styled from "styled-components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Post } from "../../Stores/postsSlice";
import { toggleBookmark } from "../../Stores/bookmarksSlice";
import { RootState } from "../../Stores/store-config";
import { colors, shadows } from "../../Styles/theme.styles";

interface Props {
    post: Post;
    compact?: boolean;
}

const Wrapper = styled.div`
    position: relative;
    &:hover .bm-btn { opacity: 1; }
`;

const BookmarkBtn = styled.button<{ $saved: boolean }>`
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: 1px solid ${({ $saved }) => ($saved ? colors.accent : colors.border)};
    background: ${({ $saved }) => ($saved ? colors.accentLight : "var(--c-bg)")};
    color: ${({ $saved }) => ($saved ? colors.accent : colors.textLight)};
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${({ $saved }) => ($saved ? 1 : 0)};
    transition: all 0.15s;
    cursor: pointer;
    z-index: 2;

    &:hover {
        border-color: ${colors.accent};
        color: ${colors.accent};
        background: ${colors.accentLight};
    }
`;

const Card = styled(Link)<{ $compact?: boolean }>`
    display: block;
    background: var(--c-bg);
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
`;

const Title = styled.h3<{ $compact?: boolean }>`
    font-size: ${({ $compact }) => ($compact ? "0.975rem" : "1.05rem")};
    font-weight: 600;
    color: ${colors.text};
    line-height: 1.4;
    margin-bottom: 0.5rem;
    letter-spacing: -0.01em;
    padding-right: ${({ $compact }) => ($compact ? 0 : "1.5rem")};

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
    gap: 0.5rem;
    font-size: 0.75rem;
    color: ${colors.textLight};
    flex-wrap: wrap;
`;

const Dot = styled.span`
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: ${colors.textLight};
    flex-shrink: 0;
`;

const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diff === 0) return "오늘";
    if (diff === 1) return "어제";
    if (diff < 7) return `${diff}일 전`;
    return d.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
        year: diff > 365 ? "numeric" : undefined,
    });
};

const readTime = (content: string) =>
    Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));

const READ_KEY = "cs_blog_read_posts";
const getReadList = (): string[] => {
    try { return JSON.parse(localStorage.getItem(READ_KEY) || "[]"); } catch { return []; }
};

const PostCard = ({ post, compact }: Props) => {
    const dispatch = useDispatch();
    const bookmarks = useSelector((s: RootState) => s.bookmarks.ids);
    const viewCount = useSelector((s: RootState) => s.views.counts[post.id] || 0);
    const isSaved = bookmarks.includes(post.id);
    const isRead = getReadList().includes(post.id);

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleBookmark(post.id));
    };

    return (
        <Wrapper>
            {!compact && (
                <BookmarkBtn
                    className="bm-btn"
                    $saved={isSaved}
                    onClick={handleBookmark}
                    title={isSaved ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                >
                    {isSaved ? "★" : "☆"}
                </BookmarkBtn>
            )}
            <Card to={`/post/${post.id}`} $compact={compact}>
                {post.tags.length > 0 && (
                    <TagRow>
                        {post.tags.slice(0, 3).map((t) => (
                            <Tag key={t}>#{t}</Tag>
                        ))}
                    </TagRow>
                )}
                <Title $compact={compact}>{post.title}</Title>
                {!compact && post.excerpt && <Excerpt>{post.excerpt}</Excerpt>}
                <Meta>
                    {isRead && (
                        <>
                            <span style={{ color: "#16a34a", fontSize: "0.7rem", fontWeight: 600 }}>✓ 완독</span>
                            <Dot />
                        </>
                    )}
                    {post.pinned && (
                        <>
                            <span style={{ color: colors.accent }}>📌</span>
                            <Dot />
                        </>
                    )}
                    <span>{formatDate(post.createdAt)}</span>
                    {!compact && (
                        <>
                            <Dot />
                            <span>📖 {readTime(post.content)}분</span>
                            {viewCount > 0 && (
                                <>
                                    <Dot />
                                    <span>👀 {viewCount}</span>
                                </>
                            )}
                        </>
                    )}
                    {isSaved && (
                        <>
                            <Dot />
                            <span style={{ color: colors.accent }}>★ 저장됨</span>
                        </>
                    )}
                </Meta>
            </Card>
        </Wrapper>
    );
};

export default PostCard;
