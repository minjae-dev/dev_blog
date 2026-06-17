import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { colors } from "../../Styles/theme.styles";
import { RootState } from "../../Stores/store-config";
import { setNote } from "../../Stores/notesSlice";

interface Props { postId: string; }

const Wrap = styled.div`
    margin-top: 2.5rem;
    border: 1px solid ${colors.border};
    border-radius: 12px;
    overflow: hidden;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: ${colors.bgAlt};
    border-bottom: 1px solid ${colors.border};
`;

const HeaderTitle = styled.h4`
    font-size: 0.82rem;
    font-weight: 700;
    color: ${colors.textMuted};
    letter-spacing: 0.04em;
`;

const HeaderMeta = styled.span`
    font-size: 0.72rem;
    color: ${colors.textLight};
`;

const TextArea = styled.textarea`
    width: 100%;
    min-height: 120px;
    padding: 1rem;
    border: none;
    outline: none;
    resize: vertical;
    font-size: 0.875rem;
    font-family: inherit;
    line-height: 1.65;
    color: ${colors.text};
    background: var(--c-bg);
    box-sizing: border-box;

    &::placeholder { color: ${colors.textLight}; }
`;

const Footer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    background: ${colors.bgAlt};
    border-top: 1px solid ${colors.border};
`;

const CharCount = styled.span`
    font-size: 0.72rem;
    color: ${colors.textLight};
`;

const SaveStatus = styled.span<{ $saved: boolean }>`
    font-size: 0.72rem;
    color: ${({ $saved }) => ($saved ? colors.success : colors.textLight)};
    transition: color 0.3s;
`;

const PersonalNote = ({ postId }: Props) => {
    const dispatch = useDispatch();
    const saved = useSelector((s: RootState) => s.notes.notes[postId] || "");
    const [text, setText] = useState(saved);
    const [showSaved, setShowSaved] = useState(false);
    const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => { setText(saved); }, [postId, saved]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setText(val);
        if (timer) clearTimeout(timer);
        const t = setTimeout(() => {
            dispatch(setNote({ id: postId, text: val }));
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 2000);
        }, 800);
        setTimer(t);
    };

    return (
        <Wrap>
            <Header>
                <HeaderTitle>📝 나의 학습 메모</HeaderTitle>
                <HeaderMeta>이 글에 대한 개인 메모 (자동 저장)</HeaderMeta>
            </Header>
            <TextArea
                value={text}
                onChange={handleChange}
                placeholder="이 글을 읽으며 떠오른 생각, 요약, 추가 학습 계획을 메모해두세요…"
            />
            <Footer>
                <CharCount>{text.length}자</CharCount>
                <SaveStatus $saved={showSaved}>
                    {showSaved ? "✓ 저장됨" : text.length > 0 ? "입력 중…" : "아직 작성된 메모가 없어요"}
                </SaveStatus>
            </Footer>
        </Wrap>
    );
};

export default PersonalNote;
