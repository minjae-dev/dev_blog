import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { addPost, updatePost } from "../../Stores/postsSlice";
import { RootState } from "../../Stores/store-config";
import { colors, media } from "../../Styles/theme.styles";

const Page = styled.main`
    max-width: 900px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 4rem;
`;

const PageHeader = styled.div`
    margin-bottom: 1.75rem;
`;

const PageTitle = styled.h1`
    font-size: 1.4rem;
    font-weight: 700;
    color: ${colors.text};
    letter-spacing: -0.02em;
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
`;

const TitleInput = styled.input`
    padding: 0.75rem 1rem;
    border: 1px solid ${colors.border};
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    color: ${colors.text};
    background: ${colors.bg};
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
    background: ${colors.bg};
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
    background: ${colors.bg};
    outline: none;
    transition: border-color 0.15s;
    &::placeholder { color: ${colors.textLight}; }
    &:focus { border-color: ${colors.accent}; }
`;

const TagHint = styled.span`
    font-size: 0.75rem;
    color: ${colors.textLight};
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

const PLACEHOLDER = `## What I Learned Today

Explain the concept in your own words...

## Code Example

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

## Key Takeaways

- Time complexity: O(log n)
- Space complexity: O(1)

## References

- Link or book reference here
`;

const Write = () => {
    const [searchParams] = useSearchParams();
    const editId = searchParams.get("edit");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const existingPost = useSelector((s: RootState) =>
        editId ? s.posts.posts.find((p) => p.id === editId) : undefined
    );

    const editorRef = useRef<any>(null);
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (existingPost) {
            setTitle(existingPost.title);
            setExcerpt(existingPost.excerpt);
            setTagInput(existingPost.tags.join(", "));
        }
    }, [existingPost]);

    const parseTags = (input: string) =>
        input.split(",").map((t) => t.trim()).filter((t) => t.length > 0);

    const tags = parseTags(tagInput);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const content = editorRef.current?.getInstance()?.getMarkdown() || "";

        if (!title.trim()) { setError("Title is required."); return; }
        if (!content.trim()) { setError("Content cannot be empty."); return; }
        setError("");

        const autoExcerpt =
            excerpt.trim() ||
            content.replace(/#{1,6}\s[^\n]*/g, "").replace(/[*_`>~\[\]#]/g, "").replace(/\n+/g, " ").trim().slice(0, 160);

        if (editId && existingPost) {
            dispatch(updatePost({ id: editId, title: title.trim(), content, excerpt: autoExcerpt, tags }));
            navigate(`/post/${editId}`);
        } else {
            dispatch(addPost({ title: title.trim(), content, excerpt: autoExcerpt, tags }));
            navigate("/");
        }
    };

    return (
        <Page>
            <PageHeader>
                <PageTitle>{editId ? "Edit Post" : "New Post"}</PageTitle>
            </PageHeader>

            <Form onSubmit={handleSubmit}>
                <Field>
                    <Label>Title</Label>
                    <TitleInput
                        placeholder="e.g. Understanding Big-O Notation"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Field>

                <Field>
                    <Label>
                        Excerpt{" "}
                        <span style={{ fontWeight: 400, textTransform: "none", fontSize: "0.72rem", color: colors.textLight }}>
                            (optional — auto-generated from content if blank)
                        </span>
                    </Label>
                    <ExcerptInput
                        placeholder="A short description of what this post covers…"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                    />
                </Field>

                <Field>
                    <Label>Tags</Label>
                    <TagInput
                        placeholder="algorithms, dynamic-programming, graphs"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                    />
                    <TagHint>Separate with commas</TagHint>
                    {tags.length > 0 && (
                        <TagPreview>
                            {tags.map((t) => <Tag key={t}>{t}</Tag>)}
                        </TagPreview>
                    )}
                </Field>

                <Field>
                    <Label>Content (Markdown)</Label>
                    <EditorWrapper>
                        <Editor
                            ref={editorRef}
                            initialValue={existingPost?.content || PLACEHOLDER}
                            previewStyle="tab"
                            height="540px"
                            initialEditType="markdown"
                            useCommandShortcut={true}
                        />
                    </EditorWrapper>
                </Field>

                {error && <ErrorMsg>{error}</ErrorMsg>}

                <Actions>
                    <CancelBtn type="button" onClick={() => navigate(-1)}>
                        Cancel
                    </CancelBtn>
                    <SubmitBtn type="submit">
                        {editId ? "Save Changes" : "Publish Post"}
                    </SubmitBtn>
                </Actions>
            </Form>
        </Page>
    );
};

export default Write;
