import { useState, useMemo } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../../Stores/store-config";
import PostCard from "../../Components/Blog/PostCard";
import { colors, media } from "../../Styles/theme.styles";

const Page = styled.main`
    max-width: 860px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 3rem;
`;

const PageHeader = styled.div`
    margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
    font-size: 1.5rem;
    font-weight: 700;
    color: ${colors.text};
    letter-spacing: -0.03em;
    margin-bottom: 0.3rem;
`;

const PageDesc = styled.p`
    font-size: 0.875rem;
    color: ${colors.textMuted};
`;

const Controls = styled.div`
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
`;

const SearchInput = styled.input`
    flex: 1;
    min-width: 200px;
    padding: 0.6rem 0.9rem;
    border: 1px solid ${colors.border};
    border-radius: 8px;
    font-size: 0.875rem;
    color: ${colors.text};
    background: ${colors.bg};
    outline: none;
    transition: border-color 0.15s;

    &::placeholder {
        color: ${colors.textLight};
    }

    &:focus {
        border-color: ${colors.accent};
    }
`;

const TagFilter = styled.button<{ $active: boolean }>`
    padding: 0.45rem 0.85rem;
    border-radius: 6px;
    font-size: 0.78rem;
    font-weight: 500;
    border: 1px solid ${({ $active }) => ($active ? colors.accent : colors.border)};
    color: ${({ $active }) => ($active ? colors.accent : colors.textMuted)};
    background: ${({ $active }) => ($active ? colors.accentLight : colors.bg)};
    cursor: pointer;
    transition: all 0.15s;

    &:hover {
        border-color: ${colors.accent};
        color: ${colors.accent};
        background: ${colors.accentLight};
    }
`;

const PostList = styled.div`
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
    color: ${colors.textMuted};
    border: 1px dashed ${colors.border};
    border-radius: 10px;
    grid-column: 1 / -1;
    font-size: 0.9rem;
`;

const ResultCount = styled.p`
    font-size: 0.8rem;
    color: ${colors.textLight};
    margin-bottom: 1rem;
`;

const Posts = () => {
    const posts = useSelector((s: RootState) => s.posts.posts);
    const [query, setQuery] = useState("");
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const allTags = useMemo(() => {
        const set = new Set<string>();
        posts.forEach((p) => p.tags.forEach((t) => set.add(t)));
        return Array.from(set).slice(0, 12);
    }, [posts]);

    const filtered = useMemo(() => {
        return posts.filter((p) => {
            const matchSearch =
                !query ||
                p.title.toLowerCase().includes(query.toLowerCase()) ||
                p.excerpt.toLowerCase().includes(query.toLowerCase()) ||
                p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
            const matchTag = !activeTag || p.tags.includes(activeTag);
            return matchSearch && matchTag;
        });
    }, [posts, query, activeTag]);

    return (
        <Page>
            <PageHeader>
                <PageTitle>All Posts</PageTitle>
                <PageDesc>{posts.length} {posts.length === 1 ? "entry" : "entries"} in your study log</PageDesc>
            </PageHeader>

            <Controls>
                <SearchInput
                    type="text"
                    placeholder="Search by title, excerpt, or tag…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </Controls>

            {allTags.length > 0 && (
                <Controls>
                    <TagFilter $active={activeTag === null} onClick={() => setActiveTag(null)}>
                        All
                    </TagFilter>
                    {allTags.map((t) => (
                        <TagFilter key={t} $active={activeTag === t} onClick={() => setActiveTag(t === activeTag ? null : t)}>
                            {t}
                        </TagFilter>
                    ))}
                </Controls>
            )}

            {(query || activeTag) && (
                <ResultCount>
                    {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                    {activeTag ? ` tagged "${activeTag}"` : ""}
                    {query ? ` for "${query}"` : ""}
                </ResultCount>
            )}

            <PostList>
                {filtered.length === 0 ? (
                    <EmptyState>
                        {posts.length === 0 ? "No posts yet. Write your first entry!" : "No posts match your search."}
                    </EmptyState>
                ) : (
                    filtered.map((p) => <PostCard key={p.id} post={p} />)
                )}
            </PostList>
        </Page>
    );
};

export default Posts;
