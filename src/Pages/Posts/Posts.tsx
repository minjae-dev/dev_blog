import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import PostCard from "../../Components/Blog/PostCard";
import { RootState } from "../../Stores/store-config";
import { colors, media } from "../../Styles/theme.styles";

type SortMode = "newest" | "oldest" | "views";

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

const TabRow = styled.div`
    display: flex;
    gap: 0.25rem;
    margin-bottom: 1.25rem;
    border-bottom: 1px solid ${colors.border};
    padding-bottom: 0;
`;

const Tab = styled.button<{ $active: boolean }>`
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: ${({ $active }) => ($active ? "600" : "400")};
    color: ${({ $active }) => ($active ? colors.accent : colors.textMuted)};
    border: none;
    border-bottom: 2px solid
        ${({ $active }) => ($active ? colors.accent : "transparent")};
    background: transparent;
    cursor: pointer;
    transition: all 0.15s;
    margin-bottom: -1px;

    &:hover {
        color: ${colors.text};
    }
`;

const Controls = styled.div`
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    align-items: center;
`;

const SearchInput = styled.input`
    flex: 1;
    min-width: 200px;
    padding: 0.6rem 0.9rem;
    border: 1px solid ${colors.border};
    border-radius: 8px;
    font-size: 0.875rem;
    color: ${colors.text};
    background: var(--c-bg);
    outline: none;
    transition: border-color 0.15s;

    &::placeholder {
        color: ${colors.textLight};
    }
    &:focus {
        border-color: ${colors.accent};
    }
`;

const SortBtn = styled.button<{ $active: boolean }>`
    padding: 0.45rem 0.8rem;
    border-radius: 6px;
    font-size: 0.78rem;
    font-weight: 500;
    border: 1px solid
        ${({ $active }) => ($active ? colors.accent : colors.border)};
    color: ${({ $active }) => ($active ? colors.accent : colors.textMuted)};
    background: ${({ $active }) =>
        $active ? colors.accentLight : "transparent"};
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;

    &:hover {
        border-color: ${colors.accent};
        color: ${colors.accent};
        background: ${colors.accentLight};
    }
`;

const TagRow = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
`;

const TagFilter = styled.button<{ $active: boolean }>`
    padding: 0.35rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid
        ${({ $active }) => ($active ? colors.accent : colors.border)};
    color: ${({ $active }) => ($active ? colors.accent : colors.textMuted)};
    background: ${({ $active }) =>
        $active ? colors.accentLight : "transparent"};
    cursor: pointer;
    transition: all 0.15s;

    &:hover {
        border-color: ${colors.accent};
        color: ${colors.accent};
        background: ${colors.accentLight};
    }
`;

const PostList = styled.div<{ $view: "grid" | "list" }>`
    display: grid;
    grid-template-columns: ${({ $view }) =>
        $view === "list" ? "1fr" : "1fr 1fr"};
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
    line-height: 1.6;
`;

const ResultBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
`;

const ResultCount = styled.p`
    font-size: 0.8rem;
    color: ${colors.textLight};
`;

const ClearBtn = styled.button`
    font-size: 0.75rem;
    color: ${colors.accent};
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    text-decoration: underline dotted;

    &:hover {
        color: ${colors.accentHover};
    }
`;

const PAGE_SIZE = 12;

const Posts = () => {
    const posts = useSelector((s: RootState) => s.posts.posts);
    const bookmarkIds = useSelector((s: RootState) => s.bookmarks.ids);
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortMode>("newest");
    const viewCounts = useSelector((s: RootState) => s.views.counts);
    const [activeTag, setActiveTag] = useState<string | null>(() =>
        searchParams.get("tag"),
    );
    const [tab, setTab] = useState<"all" | "bookmarks">(() =>
        searchParams.get("bookmarks") === "1" ? "bookmarks" : "all",
    );
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [view, setView] = useState<"grid" | "list">("grid");
    const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">(
        "all",
    );
    const readIds = useMemo(() => {
        try {
            return JSON.parse(
                localStorage.getItem("cs_blog_read_posts") || "[]",
            ) as string[];
        } catch {
            return [] as string[];
        }
    }, []);

    useEffect(() => {
        const tag = searchParams.get("tag");
        if (tag) setActiveTag(tag);
        if (searchParams.get("bookmarks") === "1") setTab("bookmarks");
    }, [searchParams]);

    const allTags = useMemo(() => {
        const source =
            tab === "bookmarks"
                ? posts.filter((p) => bookmarkIds.includes(p.id))
                : posts;
        const counts: Record<string, number> = {};
        source.forEach((p) =>
            p.tags.forEach((t) => {
                counts[t] = (counts[t] || 0) + 1;
            }),
        );
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .map(([t]) => t)
            .slice(0, 16);
    }, [posts, bookmarkIds, tab]);

    const filtered = useMemo(() => {
        const source =
            tab === "bookmarks"
                ? posts.filter((p) => bookmarkIds.includes(p.id))
                : posts;
        let result = source.filter((p) => {
            const q = query.toLowerCase();
            const matchSearch =
                !q ||
                p.title.toLowerCase().includes(q) ||
                p.excerpt.toLowerCase().includes(q) ||
                p.tags.some((t) => t.toLowerCase().includes(q)) ||
                p.content.toLowerCase().includes(q);
            const matchTag =
                !activeTag ||
                p.tags
                    .map((t) => t.toLowerCase())
                    .includes(activeTag.toLowerCase());
            return matchSearch && matchTag;
        });

        if (readFilter === "read")
            result = result.filter((p) => readIds.includes(p.id));
        else if (readFilter === "unread")
            result = result.filter((p) => !readIds.includes(p.id));

        if (sortBy === "oldest") result = [...result].reverse();
        else if (sortBy === "views")
            result = [...result].sort(
                (a, b) => (viewCounts[b.id] || 0) - (viewCounts[a.id] || 0),
            );
        else
            result = [...result].sort(
                (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || 0,
            );
        return result;
    }, [
        posts,
        bookmarkIds,
        query,
        activeTag,
        sortBy,
        tab,
        readFilter,
        readIds,
    ]);

    const handleTagClick = (tag: string) => {
        const next = tag === activeTag ? null : tag;
        setActiveTag(next);
        const params: Record<string, string> = {};
        if (next) params.tag = next;
        if (tab === "bookmarks") params.bookmarks = "1";
        setSearchParams(params);
    };

    const handleTabChange = (t: "all" | "bookmarks") => {
        setTab(t);
        setActiveTag(null);
        setQuery("");
        setVisibleCount(PAGE_SIZE);
        setSearchParams(t === "bookmarks" ? { bookmarks: "1" } : {});
    };

    const clearFilters = () => {
        setQuery("");
        setActiveTag(null);
        setSearchParams(tab === "bookmarks" ? { bookmarks: "1" } : {});
    };

    const hasFilter = !!query || !!activeTag;
    const totalCount = tab === "bookmarks" ? bookmarkIds.length : posts.length;

    return (
        <Page>
            <PageHeader>
                <PageTitle>
                    {tab === "bookmarks" ? "즐겨찾기" : "전체 글"}
                </PageTitle>
                <PageDesc>
                    {totalCount}개의{" "}
                    {tab === "bookmarks" ? "저장된 글" : "학습 기록"}
                    {activeTag ? ` · #${activeTag} 필터 중` : ""}
                </PageDesc>
            </PageHeader>

            <TabRow>
                <Tab
                    $active={tab === "all"}
                    onClick={() => handleTabChange("all")}
                >
                    전체 글 ({posts.length})
                </Tab>
                <Tab
                    $active={tab === "bookmarks"}
                    onClick={() => handleTabChange("bookmarks")}
                >
                    ★ 즐겨찾기 ({bookmarkIds.length})
                </Tab>
            </TabRow>

            <Controls>
                <SearchInput
                    type="text"
                    placeholder="제목, 내용, 태그로 검색…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <SortBtn
                    $active={sortBy === "newest"}
                    onClick={() => setSortBy("newest")}
                >
                    최신순
                </SortBtn>
                <SortBtn
                    $active={sortBy === "oldest"}
                    onClick={() => setSortBy("oldest")}
                >
                    오래된순
                </SortBtn>
                <SortBtn
                    $active={sortBy === "views"}
                    onClick={() => setSortBy("views")}
                >
                    👀 조회수
                </SortBtn>
                <SortBtn
                    $active={readFilter === "unread"}
                    onClick={() =>
                        setReadFilter(
                            readFilter === "unread" ? "all" : "unread",
                        )
                    }
                >
                    미완독
                </SortBtn>
                <SortBtn
                    $active={readFilter === "read"}
                    onClick={() =>
                        setReadFilter(readFilter === "read" ? "all" : "read")
                    }
                >
                    ✓ 완독
                </SortBtn>
                <SortBtn
                    $active={view === "grid"}
                    onClick={() => setView("grid")}
                    title="그리드 보기"
                >
                    ⊞
                </SortBtn>
                <SortBtn
                    $active={view === "list"}
                    onClick={() => setView("list")}
                    title="목록 보기"
                >
                    ≡
                </SortBtn>
            </Controls>

            {allTags.length > 0 && (
                <TagRow>
                    <TagFilter
                        $active={!activeTag}
                        onClick={() => handleTagClick("")}
                    >
                        전체
                    </TagFilter>
                    {allTags.map((t) => (
                        <TagFilter
                            key={t}
                            $active={
                                activeTag?.toLowerCase() === t.toLowerCase()
                            }
                            onClick={() => handleTagClick(t)}
                        >
                            #{t}
                        </TagFilter>
                    ))}
                </TagRow>
            )}

            <ResultBar>
                <ResultCount>
                    {hasFilter
                        ? `${filtered.length}개 결과${activeTag ? ` — #${activeTag}` : ""}${query ? ` "${query}"` : ""}`
                        : `총 ${totalCount}개`}
                </ResultCount>
                {hasFilter && (
                    <ClearBtn onClick={clearFilters}>필터 초기화</ClearBtn>
                )}
            </ResultBar>

            <PostList $view={view}>
                {filtered.length === 0 ? (
                    <EmptyState>
                        {tab === "bookmarks" && totalCount === 0
                            ? "⭐ 즐겨찾기한 글이 없어요.\n글 카드에 마우스를 올리면 ☆ 버튼으로 저장할 수 있어요."
                            : posts.length === 0
                              ? "아직 작성된 글이 없어요. 첫 글을 작성해보세요!"
                              : "검색 결과가 없어요."}
                    </EmptyState>
                ) : (
                    filtered
                        .slice(0, visibleCount)
                        .map((p) => <PostCard key={p.id} post={p} />)
                )}
            </PostList>

            {filtered.length > visibleCount && (
                <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                    <SortBtn
                        $active={false}
                        onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                        style={{ padding: "0.6rem 2rem", fontSize: "0.85rem" }}
                    >
                        더 보기 ({filtered.length - visibleCount}개 남음)
                    </SortBtn>
                </div>
            )}
        </Page>
    );
};

export default Posts;
