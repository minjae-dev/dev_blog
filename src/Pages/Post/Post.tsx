import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { RootState } from "../../Stores/store-config";
import { deletePost, duplicatePost, togglePin } from "../../Stores/postsSlice";
import { toggleBookmark } from "../../Stores/bookmarksSlice";
import { incrementView } from "../../Stores/viewsSlice";
import { colors, media } from "../../Styles/theme.styles";
import useExportMarkdown from "../../hooks/useExportMarkdown";
import TableOfContents from "../../Components/Blog/TableOfContents";
import RelatedPosts from "../../Components/Blog/RelatedPosts";
import PersonalNote from "../../Components/Blog/PersonalNote";
import ReadingProgress from "../../Components/Blog/ReadingProgress";
import useCopyCodeBlocks from "../../hooks/useCopyCodeBlocks";

const READ_KEY = "cs_blog_read_posts";

const PostNav = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-top: 2rem;
    margin-bottom: 0.5rem;
`;

const NavLink = styled(Link)<{ $align?: "right" }>`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.9rem 1rem;
    background: var(--c-bg);
    border: 1px solid ${colors.border};
    border-radius: 10px;
    transition: border-color 0.15s, transform 0.12s;
    text-align: ${({ $align }) => $align || "left"};
    ${({ $align }) => $align === "right" ? "align-items: flex-end;" : ""}

    &:hover {
        border-color: ${colors.accent};
        transform: translateY(-1px);
    }
`;

const NavDir = styled.span`
    font-size: 0.68rem;
    color: ${colors.textLight};
    font-weight: 500;
`;

const NavTitle = styled.span`
    font-size: 0.82rem;
    font-weight: 600;
    color: ${colors.text};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const Outer = styled.div`
    display: flex;
    justify-content: center;
    gap: 2.5rem;
    padding: 2.5rem 1.5rem 4rem;
    max-width: 1100px;
    margin: 0 auto;

    ${media.laptop} {
        gap: 1.75rem;
    }
`;

const TocWrapper = styled.div`
    display: block;

    ${media.tablet} {
        display: none;
    }
`;

const Page = styled.main`
    flex: 1;
    min-width: 0;
    max-width: 720px;
`;

const Breadcrumb = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    font-size: 0.8rem;
    color: ${colors.textLight};
    flex-wrap: wrap;
`;

const BreadLink = styled(Link)`
    color: ${colors.accent};
    &:hover { text-decoration: underline; }
`;

const Header = styled.header`
    margin-bottom: 2rem;
`;

const TagRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 1rem;
`;

const Tag = styled(Link)`
    font-size: 0.72rem;
    font-weight: 500;
    color: ${colors.accent};
    background: ${colors.accentLight};
    padding: 0.2em 0.65em;
    border-radius: 4px;
    transition: opacity 0.15s;

    &:hover { opacity: 0.75; }
`;

const Title = styled.h1`
    font-size: 1.9rem;
    font-weight: 700;
    color: ${colors.text};
    line-height: 1.3;
    letter-spacing: -0.03em;
    margin-bottom: 0.75rem;

    ${media.mobile} { font-size: 1.5rem; }
`;

const Meta = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.8rem;
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

const Divider = styled.hr`
    border: none;
    border-top: 1px solid ${colors.border};
    margin: 1.75rem 0;
`;

const Content = styled.article`
    min-height: 200px;
`;

const Actions = styled.div`
    display: flex;
    gap: 0.75rem;
    justify-content: space-between;
    align-items: center;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid ${colors.border};
    flex-wrap: wrap;
`;

const LeftActions = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
`;

const RightActions = styled.div`
    display: flex;
    gap: 0.75rem;
    align-items: center;
`;

const ActionBtn = styled.button<{ $variant?: "danger" | "default" }>`
    padding: 0.5rem 1.1rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.15s;
    border: 1px solid ${({ $variant }) => ($variant === "danger" ? colors.danger : colors.border)};
    color: ${({ $variant }) => ($variant === "danger" ? colors.danger : colors.textMuted)};
    background: transparent;

    &:hover {
        background: ${({ $variant }) => ($variant === "danger" ? colors.danger : colors.text)};
        color: #fff;
        border-color: ${({ $variant }) => ($variant === "danger" ? colors.danger : colors.text)};
    }
`;

const EditLink = styled(Link)`
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1.1rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 500;
    border: 1px solid ${colors.border};
    color: ${colors.textMuted};
    transition: all 0.15s;

    &:hover {
        background: ${colors.text};
        color: #fff;
        border-color: ${colors.text};
    }
`;

const BackBtn = styled(Link)`
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1.1rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 500;
    border: 1px solid ${colors.border};
    color: ${colors.textMuted};
    transition: all 0.15s;

    &:hover {
        background: ${colors.bgAlt};
        color: ${colors.text};
    }
`;

const CopyLinkBtn = styled.button<{ $copied: boolean }>`
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.82rem;
    font-weight: 500;
    border: 1px solid ${({ $copied }) => ($copied ? colors.success : colors.border)};
    color: ${({ $copied }) => ($copied ? colors.success : colors.textMuted)};
    background: transparent;
    transition: all 0.2s;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.35rem;

    &:hover {
        background: ${colors.bgAlt};
        color: ${colors.text};
    }
`;

const NotFound = styled.div`
    text-align: center;
    padding: 5rem 1.5rem;
    color: ${colors.textMuted};
`;

const ConfirmOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    backdrop-filter: blur(3px);
`;

const ConfirmBox = styled.div`
    background: var(--c-bg);
    border: 1px solid ${colors.border};
    border-radius: 14px;
    padding: 2rem;
    max-width: 380px;
    width: 90%;
    text-align: center;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
`;

const ConfirmTitle = styled.h3`
    font-size: 1rem;
    font-weight: 700;
    color: ${colors.text};
    margin-bottom: 0.5rem;
`;

const ConfirmDesc = styled.p`
    font-size: 0.875rem;
    color: ${colors.textMuted};
    margin-bottom: 1.5rem;
    line-height: 1.5;
`;

const ConfirmBtns = styled.div`
    display: flex;
    gap: 0.75rem;
    justify-content: center;
`;

const ProgressBar = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, ${colors.accent}, #06b6d4);
    z-index: 999;
    transition: width 0.1s linear;
`;

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });

const readTime = (content: string) =>
    Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));

const Post = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const post = useSelector((s: RootState) => s.posts.posts.find((p) => p.id === id));
    const allPosts = useSelector((s: RootState) => s.posts.posts);
    const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
    const bookmarkIds = useSelector((s: RootState) => s.bookmarks.ids);
    const isSaved = post ? bookmarkIds.includes(post.id) : false;
    const viewCount = useSelector((s: RootState) => (post ? s.views.counts[post.id] || 0 : 0));
    const sortedPosts = [...allPosts].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const currentIdx = sortedPosts.findIndex((p) => p.id === id);
    const prevPost = currentIdx > 0 ? sortedPosts[currentIdx - 1] : null;
    const nextPost = currentIdx < sortedPosts.length - 1 ? sortedPosts[currentIdx + 1] : null;

    const { exportPost } = useExportMarkdown();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [scrollPct, setScrollPct] = useState(0);
    const [isRead, setIsRead] = useState(() => {
        try {
            const raw = localStorage.getItem(READ_KEY);
            const list: string[] = raw ? JSON.parse(raw) : [];
            return id ? list.includes(id) : false;
        } catch { return false; }
    });
    const contentRef = useRef<HTMLElement | null>(null);

    const toggleRead = () => {
        setIsRead((prev) => {
            const next = !prev;
            try {
                const raw = localStorage.getItem(READ_KEY);
                const list: string[] = raw ? JSON.parse(raw) : [];
                const updated = next
                    ? Array.from(new Set([...list, id!]))
                    : list.filter((x) => x !== id);
                localStorage.setItem(READ_KEY, JSON.stringify(updated));
            } catch {}
            return next;
        });
    };

    useCopyCodeBlocks(contentRef.current);

    useEffect(() => {
        const handleScroll = () => {
            const el = document.documentElement;
            const scrollable = el.scrollHeight - el.clientHeight;
            if (scrollable > 0) setScrollPct((window.scrollY / scrollable) * 100);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (id) dispatch(incrementView(id));
    }, [id]);

    if (!post) {
        return (
            <Outer>
                <Page>
                    <NotFound>
                        <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍</p>
                        <p style={{ fontWeight: 600, marginBottom: "0.5rem", color: colors.text }}>
                            글을 찾을 수 없어요
                        </p>
                        <Link to="/" style={{ color: colors.accent, fontSize: "0.875rem" }}>
                            ← 홈으로 돌아가기
                        </Link>
                    </NotFound>
                </Page>
            </Outer>
        );
    }

    const handleDelete = () => {
        dispatch(deletePost(post.id));
        navigate("/");
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch {}
    };

    return (
        <>
            <ProgressBar style={{ width: `${scrollPct}%` }} />
            <Outer>
                <TocWrapper>
                    <TableOfContents content={post.content} />
                </TocWrapper>

                <Page>
                    <Breadcrumb>
                        <BreadLink to="/">홈</BreadLink>
                        <span>/</span>
                        <BreadLink to="/posts">전체 글</BreadLink>
                        <span>/</span>
                        <span>
                            {post.title.length > 40 ? post.title.slice(0, 40) + "…" : post.title}
                        </span>
                    </Breadcrumb>

                    <Header>
                        {post.tags.length > 0 && (
                            <TagRow>
                                {post.tags.map((t) => (
                                    <Tag key={t} to={`/posts?tag=${encodeURIComponent(t)}`}>
                                        #{t}
                                    </Tag>
                                ))}
                            </TagRow>
                        )}
                        <Title>{post.title}</Title>
                        <Meta>
                            <span>{formatDate(post.createdAt)}</span>
                            <Dot />
                            <span>{readTime(post.content)}분 읽기</span>
                            <Dot />
                            <span>👀 {viewCount}회</span>
                            {post.updatedAt !== post.createdAt && (
                                <>
                                    <Dot />
                                    <span>수정됨 {formatDate(post.updatedAt)}</span>
                                </>
                            )}
                        </Meta>
                    </Header>

                    <Divider />

                    <Content ref={(el) => { contentRef.current = el; }}>
                        <Viewer initialValue={post.content} />
                    </Content>

                    <Actions>
                        <LeftActions>
                            <BackBtn to="/posts">← 목록으로</BackBtn>
                            <CopyLinkBtn $copied={linkCopied} onClick={handleCopyLink}>
                                {linkCopied ? "✓ 복사됨" : "🔗 링크 복사"}
                            </CopyLinkBtn>
                            {typeof navigator !== "undefined" && "share" in navigator && (
                                <ActionBtn
                                    onClick={() => {
                                        navigator.share({
                                            title: post.title,
                                            text: post.excerpt,
                                            url: window.location.href,
                                        }).catch(() => {});
                                    }}
                                    title="공유하기"
                                >
                                    ↗ 공유
                                </ActionBtn>
                            )}
                            <ActionBtn
                                onClick={() => window.print()}
                                title="이 글 인쇄"
                            >
                                🖨 인쇄
                            </ActionBtn>
                            <ActionBtn
                                onClick={toggleRead}
                                style={{
                                    borderColor: isRead ? "#16a34a" : undefined,
                                    color: isRead ? "#16a34a" : undefined,
                                }}
                                title={isRead ? "완독 취소" : "완독 표시"}
                            >
                                {isRead ? "✓ 완독" : "완독 표시"}
                            </ActionBtn>
                            <ActionBtn
                                onClick={() => dispatch(toggleBookmark(post.id))}
                                style={{
                                    borderColor: isSaved ? colors.accent : undefined,
                                    color: isSaved ? colors.accent : undefined,
                                }}
                                title={isSaved ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                            >
                                {isSaved ? "★ 저장됨" : "☆ 저장"}
                            </ActionBtn>
                        </LeftActions>
                        {isAuthenticated && (
                            <RightActions>
                                <ActionBtn
                                    onClick={() => dispatch(togglePin(post.id))}
                                    title={post.pinned ? "상단 고정 해제" : "상단 고정"}
                                    style={post.pinned ? { borderColor: colors.accent, color: colors.accent } : {}}
                                >
                                    {post.pinned ? "📌 고정됨" : "📌 고정"}
                                </ActionBtn>
                                <ActionBtn
                                    onClick={() => exportPost(post)}
                                    title="마크다운 파일로 내보내기"
                                >
                                    ↓ .md
                                </ActionBtn>
                                <ActionBtn
                                    onClick={() => { dispatch(duplicatePost(post.id)); navigate("/"); }}
                                    title="이 글을 복제해 새 글 만들기"
                                >
                                    복제
                                </ActionBtn>
                                <ActionBtn $variant="danger" onClick={() => setConfirmDelete(true)}>
                                    삭제
                                </ActionBtn>
                                <EditLink to={`/write?edit=${post.id}`}>수정</EditLink>
                            </RightActions>
                        )}
                    </Actions>

                    {(prevPost || nextPost) && (
                        <PostNav>
                            {prevPost ? (
                                <NavLink to={`/post/${prevPost.id}`}>
                                    <NavDir>← 이전 글</NavDir>
                                    <NavTitle>{prevPost.title}</NavTitle>
                                </NavLink>
                            ) : <div />}
                            {nextPost ? (
                                <NavLink to={`/post/${nextPost.id}`} $align="right">
                                    <NavDir>다음 글 →</NavDir>
                                    <NavTitle>{nextPost.title}</NavTitle>
                                </NavLink>
                            ) : <div />}
                        </PostNav>
                    )}
                    <RelatedPosts currentPost={post} allPosts={allPosts} />
                    <PersonalNote postId={post.id} />

                    {confirmDelete && (
                        <ConfirmOverlay onClick={() => setConfirmDelete(false)}>
                            <ConfirmBox onClick={(e) => e.stopPropagation()}>
                                <ConfirmTitle>이 글을 삭제할까요?</ConfirmTitle>
                                <ConfirmDesc>
                                    &ldquo;{post.title}&rdquo;이 영구적으로 삭제됩니다. 되돌릴 수 없어요.
                                </ConfirmDesc>
                                <ConfirmBtns>
                                    <ActionBtn onClick={() => setConfirmDelete(false)}>취소</ActionBtn>
                                    <ActionBtn $variant="danger" onClick={handleDelete}>
                                        삭제하기
                                    </ActionBtn>
                                </ConfirmBtns>
                            </ConfirmBox>
                        </ConfirmOverlay>
                    )}
                </Page>
            </Outer>
        </>
    );
};

export default Post;
