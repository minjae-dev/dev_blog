import { useState, useEffect, useRef, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Stores/store-config";
import { colors } from "../../Styles/theme.styles";

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(-20px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 300;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 80px;
    animation: ${fadeIn} 0.15s ease;
    backdrop-filter: blur(4px);
`;

const Modal = styled.div`
    width: 90%;
    max-width: 580px;
    background: var(--c-bg);
    border: 1px solid ${colors.border};
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
    animation: ${slideUp} 0.18s ease;
`;

const SearchBar = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.1rem;
    border-bottom: 1px solid ${colors.border};
`;

const SearchIcon = styled.span`
    font-size: 1rem;
    color: ${colors.textLight};
    flex-shrink: 0;
`;

const Input = styled.input`
    flex: 1;
    font-size: 1rem;
    color: ${colors.text};
    background: transparent;
    border: none;
    outline: none;
    &::placeholder { color: ${colors.textLight}; }
`;

const Shortcut = styled.kbd`
    font-size: 0.7rem;
    color: ${colors.textLight};
    background: ${colors.bgAlt};
    border: 1px solid ${colors.border};
    border-radius: 4px;
    padding: 0.15em 0.45em;
    flex-shrink: 0;
`;

const Results = styled.div`
    max-height: 380px;
    overflow-y: auto;

    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 2px; }
`;

const ResultGroup = styled.div`
    padding: 0.5rem 0;
`;

const GroupLabel = styled.div`
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${colors.textLight};
    padding: 0.5rem 1.1rem 0.25rem;
`;

const ResultItem = styled(Link)<{ $focused: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 1.1rem;
    background: ${({ $focused }) => ($focused ? colors.accentLight : "transparent")};
    transition: background 0.1s;

    &:hover { background: ${colors.bgAlt}; }
`;

const ResultIcon = styled.span`
    font-size: 0.9rem;
    width: 20px;
    text-align: center;
    flex-shrink: 0;
`;

const ResultInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

const ResultTitle = styled.p`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${colors.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ResultMeta = styled.p`
    font-size: 0.72rem;
    color: ${colors.textLight};
    margin-top: 0.15rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ResultTag = styled.span`
    font-size: 0.65rem;
    color: ${colors.accent};
    background: ${colors.accentLight};
    padding: 0.15em 0.4em;
    border-radius: 3px;
    flex-shrink: 0;
`;

const Footer = styled.div`
    display: flex;
    gap: 1rem;
    padding: 0.65rem 1.1rem;
    border-top: 1px solid ${colors.border};
    background: ${colors.bgAlt};
`;

const FooterItem = styled.span`
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.72rem;
    color: ${colors.textLight};
`;

const Empty = styled.div`
    padding: 2.5rem 1.5rem;
    text-align: center;
    color: ${colors.textMuted};
    font-size: 0.875rem;
`;

const Highlight = styled.mark`
    background: ${colors.accent}30;
    color: ${colors.accent};
    border-radius: 2px;
    padding: 0 1px;
    font-weight: 600;
`;

const highlightJSX = (text: string, query: string) => {
    if (!query.trim()) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx < 0) return <>{text}</>;
    return (
        <>
            {text.slice(0, idx)}
            <Highlight>{text.slice(idx, idx + query.length)}</Highlight>
            {text.slice(idx + query.length)}
        </>
    );
};

interface Props {
    onClose: () => void;
}

const SearchModal = ({ onClose }: Props) => {
    const posts = useSelector((s: RootState) => s.posts.posts);
    const [query, setQuery] = useState("");
    const [focusIdx, setFocusIdx] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    const results = useMemo(() => {
        if (!query.trim()) return [];
        const q = query.toLowerCase();
        return posts
            .filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.content.toLowerCase().includes(q) ||
                    p.tags.some((t) => t.toLowerCase().includes(q))
            )
            .slice(0, 8);
    }, [query, posts]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocusIdx((i) => Math.min(i + 1, results.length - 1));
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusIdx((i) => Math.max(i - 1, 0));
        }
        if (e.key === "Enter" && results[focusIdx]) {
            onClose();
            window.location.href = `/post/${results[focusIdx].id}`;
        }
    };

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("ko-KR", { month: "short", day: "numeric" });

    return (
        <Overlay onClick={onClose}>
            <Modal onClick={(e) => e.stopPropagation()}>
                <SearchBar>
                    <SearchIcon>🔍</SearchIcon>
                    <Input
                        ref={inputRef}
                        placeholder="제목, 내용, 태그로 검색…"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setFocusIdx(0); }}
                        onKeyDown={handleKeyDown}
                    />
                    <Shortcut>Esc</Shortcut>
                </SearchBar>

                <Results>
                    {query.trim() === "" ? (
                        <Empty>검색어를 입력해주세요</Empty>
                    ) : results.length === 0 ? (
                        <Empty>"{query}"에 대한 결과가 없어요</Empty>
                    ) : (
                        <ResultGroup>
                            <GroupLabel>글 ({results.length})</GroupLabel>
                            {results.map((p, i) => (
                                <ResultItem
                                    key={p.id}
                                    to={`/post/${p.id}`}
                                    $focused={i === focusIdx}
                                    onClick={onClose}
                                    onMouseEnter={() => setFocusIdx(i)}
                                >
                                    <ResultIcon>📄</ResultIcon>
                                    <ResultInfo>
                                        <ResultTitle>{highlightJSX(p.title, query)}</ResultTitle>
                                        <ResultMeta>
                                            {formatDate(p.createdAt)}
                                            {p.excerpt && ` · ${p.excerpt.slice(0, 60)}…`}
                                        </ResultMeta>
                                    </ResultInfo>
                                    {p.tags[0] && <ResultTag>#{p.tags[0]}</ResultTag>}
                                </ResultItem>
                            ))}
                        </ResultGroup>
                    )}
                </Results>

                <Footer>
                    <FooterItem>
                        <Shortcut>↑↓</Shortcut> 이동
                    </FooterItem>
                    <FooterItem>
                        <Shortcut>Enter</Shortcut> 열기
                    </FooterItem>
                    <FooterItem>
                        <Shortcut>Esc</Shortcut> 닫기
                    </FooterItem>
                </Footer>
            </Modal>
        </Overlay>
    );
};

export default SearchModal;
