import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import styled from "styled-components";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { RootState } from "../../Stores/store-config";
import { deletePost } from "../../Stores/postsSlice";
import { colors, media } from "../../Styles/theme.styles";

const Page = styled.main`
    max-width: 720px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 4rem;
`;

const Breadcrumb = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    font-size: 0.8rem;
    color: ${colors.textLight};
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

const Tag = styled.span`
    font-size: 0.72rem;
    font-weight: 500;
    color: ${colors.accent};
    background: ${colors.accentLight};
    padding: 0.2em 0.65em;
    border-radius: 4px;
`;

const Title = styled.h1`
    font-size: 1.9rem;
    font-weight: 700;
    color: ${colors.text};
    line-height: 1.3;
    letter-spacing: -0.03em;
    margin-bottom: 0.75rem;

    ${media.mobile} {
        font-size: 1.5rem;
    }
`;

const Meta = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.8rem;
    color: ${colors.textLight};
`;

const Dot = styled.span`
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: ${colors.textLight};
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
    justify-content: flex-end;
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid ${colors.border};
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

const NotFound = styled.div`
    text-align: center;
    padding: 5rem 1.5rem;
    color: ${colors.textMuted};
`;

const ConfirmOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
`;

const ConfirmBox = styled.div`
    background: ${colors.bg};
    border: 1px solid ${colors.border};
    border-radius: 12px;
    padding: 1.75rem 2rem;
    max-width: 380px;
    width: 90%;
    text-align: center;
`;

const ConfirmTitle = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
`;

const ConfirmDesc = styled.p`
    font-size: 0.875rem;
    color: ${colors.textMuted};
    margin-bottom: 1.5rem;
`;

const ConfirmBtns = styled.div`
    display: flex;
    gap: 0.75rem;
    justify-content: center;
`;

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

const readTime = (content: string) =>
    Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));

const Post = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const post = useSelector((s: RootState) => s.posts.posts.find((p) => p.id === id));
    const [confirmDelete, setConfirmDelete] = useState(false);

    if (!post) {
        return (
            <Page>
                <NotFound>
                    <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍</p>
                    <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Post not found</p>
                    <Link to="/" style={{ color: colors.accent, fontSize: "0.875rem" }}>
                        ← Back to home
                    </Link>
                </NotFound>
            </Page>
        );
    }

    const handleDelete = () => {
        dispatch(deletePost(post.id));
        navigate("/");
    };

    return (
        <Page>
            <Breadcrumb>
                <BreadLink to="/">Home</BreadLink>
                <span>/</span>
                <BreadLink to="/posts">Posts</BreadLink>
                <span>/</span>
                <span>{post.title.length > 40 ? post.title.slice(0, 40) + "…" : post.title}</span>
            </Breadcrumb>

            <Header>
                {post.tags.length > 0 && (
                    <TagRow>
                        {post.tags.map((t) => (
                            <Tag key={t}>{t}</Tag>
                        ))}
                    </TagRow>
                )}
                <Title>{post.title}</Title>
                <Meta>
                    <span>{formatDate(post.createdAt)}</span>
                    <Dot />
                    <span>{readTime(post.content)} min read</span>
                    {post.updatedAt !== post.createdAt && (
                        <>
                            <Dot />
                            <span>Updated {formatDate(post.updatedAt)}</span>
                        </>
                    )}
                </Meta>
            </Header>

            <Divider />

            <Content>
                <Viewer initialValue={post.content} />
            </Content>

            <Actions>
                <ActionBtn $variant="danger" onClick={() => setConfirmDelete(true)}>
                    Delete
                </ActionBtn>
                <EditLink to={`/write?edit=${post.id}`}>Edit</EditLink>
            </Actions>

            {confirmDelete && (
                <ConfirmOverlay onClick={() => setConfirmDelete(false)}>
                    <ConfirmBox onClick={(e) => e.stopPropagation()}>
                        <ConfirmTitle>Delete this post?</ConfirmTitle>
                        <ConfirmDesc>
                            &ldquo;{post.title}&rdquo; will be permanently deleted. This cannot be undone.
                        </ConfirmDesc>
                        <ConfirmBtns>
                            <ActionBtn onClick={() => setConfirmDelete(false)}>Cancel</ActionBtn>
                            <ActionBtn $variant="danger" onClick={handleDelete}>
                                Yes, delete
                            </ActionBtn>
                        </ConfirmBtns>
                    </ConfirmBox>
                </ConfirmOverlay>
            )}
        </Page>
    );
};

export default Post;
