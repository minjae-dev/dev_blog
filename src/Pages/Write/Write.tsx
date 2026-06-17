import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { addPost, updatePost } from "../../Stores/postsSlice";
import { RootState } from "../../Stores/store-config";
import { colors, media } from "../../Styles/theme.styles";
import { templates } from "../../data/writeTemplates";

const DRAFT_KEY = "cs_blog_draft";

interface Draft {
    title: string;
    excerpt: string;
    tagInput: string;
    content: string;
    savedAt: string;
}

const loadDraft = (): Draft | null => {
    try {
        const raw = localStorage.getItem(DRAFT_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
};

const saveDraft = (d: Draft) => {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch {}
};

const clearDraft = () => {
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
};

const Page = styled.main`
    max-width: 900px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 4rem;
`;

const PageHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.75rem;
    gap: 1rem;
    flex-wrap: wrap;
`;

const PageTitle = styled.h1`
    font-size: 1.4rem;
    font-weight: 700;
    color: ${colors.text};
    letter-spacing: -0.02em;
`;

const AutoSaveMsg = styled.span<{ $visible: boolean }>`
    font-size: 0.75rem;
    color: ${colors.textLight};
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    transition: opacity 0.3s;
    display: flex;
    align-items: center;
    gap: 0.3rem;
`;

const DraftBanner = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: ${colors.accentLight};
    border: 1px solid ${colors.accent}33;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
`;

const DraftText = styled.p`
    font-size: 0.82rem;
    color: ${colors.accent};
    font-weight: 500;
`;

const DraftBtns = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const DraftBtn = styled.button<{ $primary?: boolean }>`
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.3rem 0.75rem;
    border-radius: 5px;
    border: 1px solid ${({ $primary }) => ($primary ? colors.accent : colors.border)};
    color: ${({ $primary }) => ($primary ? "#fff" : colors.textMuted)};
    background: ${({ $primary }) => ($primary ? colors.accent : "transparent")};
    cursor: pointer;
    transition: all 0.15s;

    &:hover {
        opacity: 0.85;
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`;

const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
`;

const Label = styled.label`
    font-size: 0.78rem;
    font-weight: 600;
    color: ${colors.textMuted};
    letter-spacing: 0.05em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const WordCount = styled.span`
    font-size: 0.68rem;
    color: ${colors.textLight};
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
`;

const TitleInput = styled.input`
    padding: 0.75rem 1rem;
    border: 1px solid ${colors.border};
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    color: ${colors.text};
    background: var(--c-bg);
    outline: none;
    transition: border-color 0.15s;
    letter-spacing: -0.01em;
    &::placeholder { color: ${colors.textLight}; font-weight: 400; }
    &:focus { border-color: ${colors.accent}; }
`;

const ExcerptInput = styled.textarea`
    padding: 0.7rem 1rem;
    border: 1px solid ${colors.border};
    border-radius: 8px;
    font-size: 0.875rem;
    color: ${colors.text};
    background: var(--c-bg);
    outline: none;
    resize: vertical;
    min-height: 72px;
    line-height: 1.6;
    transition: border-color 0.15s;
    &::placeholder { color: ${colors.textLight}; }
    &:focus { border-color: ${colors.accent}; }
`;

const TagInput = styled.input`
    padding: 0.6rem 1rem;
    border: 1px solid ${colors.border};
    border-radius: 8px;
    font-size: 0.875rem;
    color: ${colors.text};
    background: var(--c-bg);
    outline: none;
    transition: border-color 0.15s;
    &::placeholder { color: ${colors.textLight}; }
    &:focus { border-color: ${colors.accent}; }
`;

const TagHint = styled.span`
    font-size: 0.75rem;
    color: ${colors.textLight};
`;

const TagSuggestions = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.35rem;
`;

const SuggestTag = styled.button`
    font-size: 0.7rem;
    font-weight: 500;
    color: ${colors.textMuted};
    background: ${colors.bgAlt};
    border: 1px solid ${colors.border};
    padding: 0.18em 0.55em;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.12s;

    &:hover {
        border-color: ${colors.accent};
        color: ${colors.accent};
        background: ${colors.accentLight};
    }
`;

const TagPreview = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.25rem;
`;

const Tag = styled.span`
    font-size: 0.72rem;
    font-weight: 500;
    color: ${colors.accent};
    background: ${colors.accentLight};
    padding: 0.2em 0.65em;
    border-radius: 4px;
`;

const EditorWrapper = styled.div`
    .toastui-editor-defaultUI {
        border: 1px solid ${colors.border} !important;
        border-radius: 10px !important;
        overflow: hidden !important;
    }
`;

const Actions = styled.div`
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    padding-top: 0.5rem;
    ${media.mobile} { flex-direction: column-reverse; }
`;

const CancelBtn = styled.button`
    padding: 0.6rem 1.25rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    border: 1px solid ${colors.border};
    color: ${colors.textMuted};
    background: transparent;
    transition: all 0.15s;
    &:hover { background: ${colors.bgAlt}; color: ${colors.text}; }
`;

const SubmitBtn = styled.button`
    padding: 0.6rem 1.5rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 600;
    border: none;
    color: #fff;
    background: ${colors.accent};
    transition: background 0.15s;
    &:hover { background: ${colors.accentHover}; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ErrorMsg = styled.p`
    font-size: 0.8rem;
    color: ${colors.danger};
`;

const TemplateRow = styled.div`
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    padding: 0.75rem 0;
    border-bottom: 1px solid ${colors.border};
    margin-bottom: 0.25rem;
`;

const TemplateLabel = styled.span`
    font-size: 0.72rem;
    font-weight: 600;
    color: ${colors.textLight};
    letter-spacing: 0.05em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    margin-right: 0.25rem;
`;

const TemplateBtn = styled.button<{ $active: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.7rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid ${({ $active }) => ($active ? colors.accent : colors.border)};
    color: ${({ $active }) => ($active ? colors.accent : colors.textMuted)};
    background: ${({ $active }) => ($active ? colors.accentLight : "transparent")};
    transition: all 0.15s;
    white-space: nowrap;

    &:hover {
        border-color: ${colors.accent};
        color: ${colors.accent};
        background: ${colors.accentLight};
    }
`;

const PLACEHOLDER = `## 오늘 배운 것

내 말로 개념을 설명해보세요...

## 코드 예시

\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
\`\`\`

## 핵심 정리

- 시간 복잡도: O(log n)
- 공간 복잡도: O(1)

## 참고 자료

- 출처 링크 또는 책 이름
`;

const Write = () => {
    const [searchParams] = useSearchParams();
    const editId = searchParams.get("edit");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const existingPost = useSelector((s: RootState) =>
        editId ? s.posts.posts.find((p) => p.id === editId) : undefined
    );
    const allPosts = useSelector((s: RootState) => s.posts.posts);

    const editorRef = useRef<any>(null);
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [error, setError] = useState("");
    const [autoSaved, setAutoSaved] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [pendingDraft, setPendingDraft] = useState<Draft | null>(null);
    const [draftDismissed, setDraftDismissed] = useState(false);
    const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
    const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const applyTemplate = (templateId: string) => {
        const tpl = templates.find((t) => t.id === templateId);
        if (!tpl) return;
        setActiveTemplate(templateId);
        editorRef.current?.getInstance()?.setMarkdown(tpl.content);
        if (!tagInput && tpl.tags.length > 0) {
            setTagInput(tpl.tags.join(", "));
        }
    };

    useEffect(() => {
        if (existingPost) {
            setTitle(existingPost.title);
            setExcerpt(existingPost.excerpt);
            setTagInput(existingPost.tags.join(", "));
        } else if (!editId) {
            const draft = loadDraft();
            if (draft && !draftDismissed) {
                setPendingDraft(draft);
            }
        }
    }, [existingPost, editId]);

    const triggerAutoSave = useCallback(() => {
        if (editId) return;
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = setTimeout(() => {
            const content = editorRef.current?.getInstance()?.getMarkdown() || "";
            if (title.trim() || content.trim()) {
                saveDraft({ title, excerpt, tagInput, content, savedAt: new Date().toISOString() });
                setAutoSaved(true);
                setTimeout(() => setAutoSaved(false), 2000);
            }
        }, 3000);
    }, [title, excerpt, tagInput, editId]);

    useEffect(() => {
        triggerAutoSave();
        return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
    }, [title, excerpt, tagInput, triggerAutoSave]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                const btn = document.getElementById("write-submit-btn");
                if (btn) btn.click();
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    const restoreDraft = () => {
        if (!pendingDraft) return;
        setTitle(pendingDraft.title);
        setExcerpt(pendingDraft.excerpt);
        setTagInput(pendingDraft.tagInput);
        editorRef.current?.getInstance()?.setMarkdown(pendingDraft.content);
        setPendingDraft(null);
    };

    const parseTags = (input: string) =>
        input.split(",").map((t) => t.trim()).filter((t) => t.length > 0);

    const tags = parseTags(tagInput);

    const allExistingTags = useMemo(() => {
        const s = new Set<string>();
        allPosts.forEach((p) => p.tags.forEach((t) => s.add(t)));
        tags.forEach((t) => s.delete(t));
        return Array.from(s).slice(0, 12);
    }, [allPosts, tagInput]);

    const addSuggestedTag = (tag: string) => {
        const existing = parseTags(tagInput);
        if (existing.includes(tag)) return;
        setTagInput(existing.length > 0 ? `${existing.join(", ")}, ${tag}` : tag);
    };

    const handleEditorChange = () => {
        const content = editorRef.current?.getInstance()?.getMarkdown() || "";
        const words = content.trim().split(/\s+/).filter((w: string) => w).length;
        setWordCount(words);
        triggerAutoSave();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const content = editorRef.current?.getInstance()?.getMarkdown() || "";

        if (!title.trim()) { setError("제목을 입력해주세요."); return; }
        if (!content.trim()) { setError("내용을 입력해주세요."); return; }
        setError("");

        const autoExcerpt =
            excerpt.trim() ||
            content.replace(/#{1,6}\s[^\n]*/g, "").replace(/[*_`>~\[\]#]/g, "").replace(/\n+/g, " ").trim().slice(0, 160);

        if (editId && existingPost) {
            dispatch(updatePost({ id: editId, title: title.trim(), content, excerpt: autoExcerpt, tags }));
            navigate(`/post/${editId}`);
        } else {
            dispatch(addPost({ title: title.trim(), content, excerpt: autoExcerpt, tags }));
            clearDraft();
            navigate("/");
        }
    };

    const formatDraftTime = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <Page>
            <PageHeader>
                <PageTitle>{editId ? "글 수정" : "새 글 작성"}</PageTitle>
                {!editId && (
                    <AutoSaveMsg $visible={autoSaved}>
                        ✓ 임시저장됨{" "}
                        <span style={{ fontSize: "0.65rem", opacity: 0.7 }}>
                            {new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                    </AutoSaveMsg>
                )}
            </PageHeader>

            {pendingDraft && !editId && (
                <DraftBanner>
                    <DraftText>
                        💾 저장된 임시글이 있어요 ({formatDraftTime(pendingDraft.savedAt)}) — &ldquo;{pendingDraft.title || "제목 없음"}&rdquo;
                    </DraftText>
                    <DraftBtns>
                        <DraftBtn onClick={() => { clearDraft(); setPendingDraft(null); setDraftDismissed(true); }}>
                            무시
                        </DraftBtn>
                        <DraftBtn $primary onClick={restoreDraft}>
                            불러오기
                        </DraftBtn>
                    </DraftBtns>
                </DraftBanner>
            )}

            {!editId && (
                <TemplateRow>
                    <TemplateLabel>템플릿</TemplateLabel>
                    {templates.map((t) => (
                        <TemplateBtn
                            key={t.id}
                            type="button"
                            $active={activeTemplate === t.id}
                            onClick={() => applyTemplate(t.id)}
                        >
                            {t.emoji} {t.label}
                        </TemplateBtn>
                    ))}
                </TemplateRow>
            )}

            <Form onSubmit={handleSubmit}>
                <Field>
                    <Label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>제목</span>
                        <span style={{ fontSize: "0.68rem", fontWeight: 400, color: title.length > 80 ? "#dc2626" : colors.textLight }}>
                            {title.length}/100
                        </span>
                    </Label>
                    <TitleInput
                        placeholder="예: 이진 탐색 완전 정복"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={100}
                    />
                </Field>

                <Field>
                    <Label>
                        한 줄 요약{" "}
                        <span style={{ fontWeight: 400, textTransform: "none", fontSize: "0.72rem", color: colors.textLight }}>
                            (선택 · 비워두면 본문에서 자동 생성)
                        </span>
                    </Label>
                    <ExcerptInput
                        placeholder="이 글에서 다루는 내용을 짧게 설명해주세요…"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                    />
                </Field>

                <Field>
                    <Label>태그</Label>
                    <TagInput
                        placeholder="알고리즘, 자료구조, 다이나믹프로그래밍"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                    />
                    <TagHint>쉼표로 구분</TagHint>
                    {tags.length > 0 && (
                        <TagPreview>
                            {tags.map((t) => <Tag key={t}>#{t}</Tag>)}
                        </TagPreview>
                    )}
                    {allExistingTags.length > 0 && (
                        <TagSuggestions>
                            <span style={{ fontSize: "0.68rem", color: colors.textLight }}>추천:</span>
                            {allExistingTags.map((t) => (
                                <SuggestTag key={t} type="button" onClick={() => addSuggestedTag(t)}>
                                    + {t}
                                </SuggestTag>
                            ))}
                        </TagSuggestions>
                    )}
                </Field>

                <Field>
                    <Label>
                        내용 (마크다운)
                        {wordCount > 0 && (
                            <WordCount>{wordCount.toLocaleString()}단어 · 약 {Math.max(1, Math.ceil(wordCount / 200))}분 읽기</WordCount>
                        )}
                    </Label>
                    <EditorWrapper>
                        <Editor
                            ref={editorRef}
                            initialValue={existingPost?.content || PLACEHOLDER}
                            previewStyle="vertical"
                            height="540px"
                            initialEditType="markdown"
                            useCommandShortcut={true}
                            onChange={handleEditorChange}
                        />
                    </EditorWrapper>
                </Field>

                {error && <ErrorMsg>{error}</ErrorMsg>}

                <Actions>
                    <CancelBtn type="button" onClick={() => navigate(-1)}>
                        취소
                    </CancelBtn>
                    <SubmitBtn id="write-submit-btn" type="submit">
                        {editId ? "수정 완료" : "발행하기"}
                    </SubmitBtn>
                </Actions>
            </Form>
        </Page>
    );
};

export default Write;
