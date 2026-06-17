import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { colors } from "../../Styles/theme.styles";

interface Props {
    content: string;
}

interface Heading {
    id: string;
    text: string;
    level: number;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const Aside = styled.aside`
    position: sticky;
    top: 80px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    width: 200px;
    flex-shrink: 0;
    animation: ${fadeIn} 0.25s ease;

    &::-webkit-scrollbar { width: 3px; }
    &::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 2px; }
`;

const Label = styled.p`
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${colors.textLight};
    margin-bottom: 0.75rem;
`;

const List = styled.nav`
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
`;

const Item = styled.a<{ $level: number; $active: boolean }>`
    display: block;
    font-size: 0.75rem;
    line-height: 1.5;
    padding: 0.2rem 0.5rem;
    padding-left: ${({ $level }) => ($level === 2 ? "0.5rem" : "1.25rem")};
    border-left: 2px solid ${({ $active }) => ($active ? colors.accent : "transparent")};
    color: ${({ $active }) => ($active ? colors.accent : colors.textMuted)};
    font-weight: ${({ $active }) => ($active ? "600" : "400")};
    transition: all 0.15s;
    text-decoration: none;
    word-break: break-word;

    &:hover {
        color: ${colors.accent};
        border-left-color: ${colors.accent};
    }
`;

const slugify = (text: string) =>
    text
        .toLowerCase()
        .replace(/[^\w\s가-힣]/g, "")
        .replace(/\s+/g, "-")
        .trim();

const parseHeadings = (markdown: string): Heading[] => {
    const lines = markdown.split("\n");
    const headings: Heading[] = [];
    const seen: Record<string, number> = {};

    lines.forEach((line) => {
        const m = line.match(/^(#{2,3})\s+(.+)/);
        if (m) {
            const level = m[1].length;
            const text = m[2].trim();
            const base = slugify(text);
            seen[base] = (seen[base] || 0) + 1;
            const id = seen[base] > 1 ? `${base}-${seen[base]}` : base;
            headings.push({ id, text, level });
        }
    });

    return headings;
};

const TableOfContents = ({ content }: Props) => {
    const headings = parseHeadings(content);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveId(entry.target.id);
                });
            },
            { rootMargin: "-10% 0px -80% 0px" }
        );

        headings.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [content]);

    useEffect(() => {
        if (headings.length === 0) return;

        const seen: Record<string, number> = {};
        document.querySelectorAll<HTMLElement>(
            ".toastui-editor-contents h2, .toastui-editor-contents h3"
        ).forEach((el) => {
            const text = el.textContent?.trim() || "";
            const base = slugify(text);
            seen[base] = (seen[base] || 0) + 1;
            const id = seen[base] > 1 ? `${base}-${seen[base]}` : base;
            el.id = id;
            el.style.scrollMarginTop = "80px";
        });
    }, [content]);

    if (headings.length < 2) return null;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveId(id);
        }
    };

    return (
        <Aside>
            <Label>목차</Label>
            <List>
                {headings.map((h) => (
                    <Item
                        key={h.id}
                        href={`#${h.id}`}
                        $level={h.level}
                        $active={activeId === h.id}
                        onClick={(e) => handleClick(e, h.id)}
                    >
                        {h.text}
                    </Item>
                ))}
            </List>
        </Aside>
    );
};

export default TableOfContents;
