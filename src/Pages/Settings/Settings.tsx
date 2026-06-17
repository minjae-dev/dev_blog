import { useRef, useState, useMemo } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../Stores/store-config";
import { addPost } from "../../Stores/postsSlice";
import { clearBookmarks } from "../../Stores/bookmarksSlice";
import AchievementBadges from "../../Components/Blog/AchievementBadges";
import { colors, media } from "../../Styles/theme.styles";
import { logout } from "../../Stores/authSlice";
import { useTheme } from "../../Context/ThemeContext";

const Page = styled.main`
    max-width: 680px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 4rem;
`;

const Title = styled.h1`
    font-size: 1.4rem;
    font-weight: 700;
    color: ${colors.text};
    letter-spacing: -0.02em;
    margin-bottom: 2rem;
`;

const Section = styled.div`
    background: var(--c-bg);
    border: 1px solid ${colors.border};
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 1.5rem;
`;

const SectionHeader = styled.div`
    padding: 1rem 1.25rem;
    border-bottom: 1px solid ${colors.border};
    background: ${colors.bgAlt};
`;

const SectionTitle = styled.h2`
    font-size: 0.875rem;
    font-weight: 600;
    color: ${colors.text};
`;

const SectionDesc = styled.p`
    font-size: 0.75rem;
    color: ${colors.textMuted};
    margin-top: 0.2rem;
`;

const SectionBody = styled.div`
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
`;

const RowLabel = styled.div``;

const RowTitle = styled.p`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${colors.text};
`;

const RowSub = styled.p`
    font-size: 0.75rem;
    color: ${colors.textMuted};
    margin-top: 0.15rem;
`;

const Btn = styled.button<{ $variant?: "danger" | "success" | "default" }>`
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.82rem;
    font-weight: 500;
    border: 1px solid ${({ $variant }) =>
        $variant === "danger"
            ? colors.danger
            : $variant === "success"
            ? colors.success
            : colors.border};
    color: ${({ $variant }) =>
        $variant === "danger"
            ? colors.danger
            : $variant === "success"
            ? colors.success
            : colors.textMuted};
    background: transparent;
    transition: all 0.15s;
    white-space: nowrap;

    &:hover {
        background: ${({ $variant }) =>
            $variant === "danger"
                ? colors.danger
                : $variant === "success"
                ? colors.success
                : colors.bgAlt};
        color: ${({ $variant }) => ($variant === "danger" || $variant === "success" ? "#fff" : colors.text)};
    }
`;

const Input = styled.input`
    flex: 1;
    min-width: 180px;
    padding: 0.5rem 0.85rem;
    border: 1px solid ${colors.border};
    border-radius: 6px;
    font-size: 0.875rem;
    color: ${colors.text};
    background: var(--c-bg);
    outline: none;
    transition: border-color 0.15s;
    &::placeholder { color: ${colors.textLight}; }
    &:focus { border-color: ${colors.accent}; }
`;

const Toast = styled.div<{ $type: "success" | "error" }>`
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: ${({ $type }) => ($type === "success" ? colors.success : colors.danger)};
    color: #fff;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    z-index: 999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    white-space: nowrap;
`;

const StatGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;

    ${media.mobile} { grid-template-columns: 1fr 1fr; }
`;

const StatItem = styled.div`
    text-align: center;
    padding: 0.75rem;
    background: ${colors.bgAlt};
    border-radius: 8px;
    border: 1px solid ${colors.border};
`;

const StatNum = styled.div`
    font-size: 1.4rem;
    font-weight: 700;
    color: ${colors.text};
`;

const StatLabel = styled.div`
    font-size: 0.7rem;
    color: ${colors.textMuted};
    margin-top: 0.2rem;
`;

const DividerLine = styled.hr`
    border: none;
    border-top: 1px solid ${colors.border};
    margin: 0.25rem 0;
`;

const Settings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const posts = useSelector((s: RootState) => s.posts.posts);
    const bookmarkIds = useSelector((s: RootState) => s.bookmarks.ids);
    const viewCounts = useSelector((s: RootState) => s.views.counts);
    const noteIds = useSelector((s: RootState) => Object.keys(s.notes.notes).filter((id) => s.notes.notes[id].trim()));
    const readCount = useMemo(() => {
        try { return (JSON.parse(localStorage.getItem("cs_blog_read_posts") || "[]") as string[]).length; } catch { return 0; }
    }, []);
    const { username } = useSelector((s: RootState) => s.auth);
    const { isDark, toggleTheme } = useTheme();
    const fileRef = useRef<HTMLInputElement>(null);
    const [blogTitle, setBlogTitle] = useState(
        () => localStorage.getItem("cs_blog_title") || "CS Study Log"
    );
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const showToast = (msg: string, type: "success" | "error" = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSaveTitle = () => {
        localStorage.setItem("cs_blog_title", blogTitle.trim() || "CS Study Log");
        showToast("블로그 이름이 저장됐어요");
    };

    const handleExport = () => {
        const data = {
            version: 1,
            exportedAt: new Date().toISOString(),
            blogTitle,
            posts,
            bookmarkIds,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cslog-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(`${posts.length}개의 글이 내보내졌어요`);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target?.result as string);
                if (!data.posts || !Array.isArray(data.posts)) throw new Error("Invalid format");
                data.posts.forEach((p: any) => {
                    dispatch(addPost({
                        title: p.title,
                        content: p.content,
                        excerpt: p.excerpt || "",
                        tags: p.tags || [],
                    }));
                });
                showToast(`${data.posts.length}개의 글을 가져왔어요`);
            } catch {
                showToast("파일 형식이 올바르지 않아요", "error");
            }
        };
        reader.readAsText(file);
        e.target.value = "";
    };

    const handleClearBookmarks = () => {
        if (window.confirm("즐겨찾기를 모두 비울까요?")) {
            dispatch(clearBookmarks());
            showToast("즐겨찾기가 초기화됐어요");
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const totalWords = posts.reduce(
        (acc, p) => acc + p.content.trim().split(/\s+/).length,
        0
    );

    const totalTags = new Set(posts.flatMap((p) => p.tags)).size;

    return (
        <Page>
            <Title>설정</Title>

            <Section>
                <SectionHeader>
                    <SectionTitle>📊 내 블로그 통계</SectionTitle>
                </SectionHeader>
                <SectionBody>
                    <StatGrid>
                        <StatItem>
                            <StatNum>{posts.length}</StatNum>
                            <StatLabel>전체 글</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatNum>{totalTags}</StatNum>
                            <StatLabel>태그 수</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatNum>{bookmarkIds.length}</StatNum>
                            <StatLabel>즐겨찾기</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatNum>{Math.ceil(totalWords / 1000)}K</StatNum>
                            <StatLabel>총 단어</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatNum>
                                {posts.filter(
                                    (p) =>
                                        new Date(p.createdAt).getMonth() === new Date().getMonth() &&
                                        new Date(p.createdAt).getFullYear() === new Date().getFullYear()
                                ).length}
                            </StatNum>
                            <StatLabel>이번 달</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatNum>
                                {posts.length > 0
                                    ? Math.ceil(posts.reduce((a, p) => a + p.content.trim().split(/\s+/).length, 0) / posts.length / 200)
                                    : 0}분
                            </StatNum>
                            <StatLabel>평균 읽기</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatNum>
                                {Object.values(viewCounts).reduce((a, b) => a + b, 0)}
                            </StatNum>
                            <StatLabel>총 조회수</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatNum>{noteIds.length}</StatNum>
                            <StatLabel>개인 메모</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatNum>{posts.filter((p) => p.pinned).length}</StatNum>
                            <StatLabel>고정된 글</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatNum>{readCount}</StatNum>
                            <StatLabel>완독한 글</StatLabel>
                        </StatItem>
                    </StatGrid>
                </SectionBody>
            </Section>

            <Section>
                <SectionHeader>
                    <SectionTitle>✏️ 블로그 이름</SectionTitle>
                    <SectionDesc>Navbar 및 Footer에 표시되는 이름</SectionDesc>
                </SectionHeader>
                <SectionBody>
                    <Row>
                        <Input
                            value={blogTitle}
                            onChange={(e) => setBlogTitle(e.target.value)}
                            placeholder="CS Study Log"
                            maxLength={40}
                        />
                        <Btn $variant="success" onClick={handleSaveTitle}>저장</Btn>
                    </Row>
                </SectionBody>
            </Section>

            <Section>
                <SectionHeader>
                    <SectionTitle>🌙 화면 테마</SectionTitle>
                </SectionHeader>
                <SectionBody>
                    <Row>
                        <RowLabel>
                            <RowTitle>{isDark ? "다크 모드" : "라이트 모드"} 사용 중</RowTitle>
                            <RowSub>Navbar의 달/해 버튼으로도 전환할 수 있어요</RowSub>
                        </RowLabel>
                        <Btn onClick={toggleTheme}>
                            {isDark ? "☀️ 라이트 모드로" : "🌙 다크 모드로"}
                        </Btn>
                    </Row>
                </SectionBody>
            </Section>

            <Section>
                <SectionHeader>
                    <SectionTitle>💾 데이터 백업 및 복원</SectionTitle>
                    <SectionDesc>모든 글을 JSON 파일로 내보내거나 가져올 수 있어요</SectionDesc>
                </SectionHeader>
                <SectionBody>
                    <Row>
                        <RowLabel>
                            <RowTitle>JSON 내보내기</RowTitle>
                            <RowSub>현재 {posts.length}개의 글이 저장되어 있어요</RowSub>
                        </RowLabel>
                        <Btn $variant="success" onClick={handleExport}>
                            ↓ 내보내기
                        </Btn>
                    </Row>
                    <DividerLine />
                    <Row>
                        <RowLabel>
                            <RowTitle>JSON 가져오기</RowTitle>
                            <RowSub>이전에 내보낸 백업 파일을 불러와요</RowSub>
                        </RowLabel>
                        <Btn onClick={() => fileRef.current?.click()}>
                            ↑ 가져오기
                        </Btn>
                        <input
                            ref={fileRef}
                            type="file"
                            accept=".json"
                            style={{ display: "none" }}
                            onChange={handleImport}
                        />
                    </Row>
                </SectionBody>
            </Section>

            <Section>
                <SectionHeader>
                    <SectionTitle>⚠️ 계정</SectionTitle>
                </SectionHeader>
                <SectionBody>
                    <Row>
                        <RowLabel>
                            <RowTitle>즐겨찾기 초기화</RowTitle>
                            <RowSub>저장된 {bookmarkIds.length}개의 즐겨찾기를 모두 삭제해요</RowSub>
                        </RowLabel>
                        <Btn $variant="danger" onClick={handleClearBookmarks}>
                            초기화
                        </Btn>
                    </Row>
                    <DividerLine />
                    <Row>
                        <RowLabel>
                            <RowTitle>로그아웃</RowTitle>
                            <RowSub>{username}으로 로그인 중</RowSub>
                        </RowLabel>
                        <Btn $variant="danger" onClick={handleLogout}>
                            로그아웃
                        </Btn>
                    </Row>
                </SectionBody>
            </Section>

            <AchievementBadges posts={posts} />

            {toast && <Toast $type={toast.type}>{toast.msg}</Toast>}
        </Page>
    );
};

export default Settings;
