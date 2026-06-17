import { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { colors } from "../../Styles/theme.styles";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Btn = styled.button<{ $visible: boolean }>`
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: 1px solid ${colors.border};
    background: var(--c-bg);
    color: ${colors.textMuted};
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: all 0.15s;
    z-index: 50;
    pointer-events: ${({ $visible }) => $visible ? "all" : "none"};
    opacity: ${({ $visible }) => $visible ? 1 : 0};
    ${({ $visible }) => $visible && css`animation: ${fadeIn} 0.2s ease;`}

    &:hover {
        background: ${colors.accent};
        color: #fff;
        border-color: ${colors.accent};
        transform: translateY(-2px);
    }
`;

const BackToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <Btn
            $visible={visible}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            title="맨 위로"
            aria-label="맨 위로 스크롤"
        >
            ↑
        </Btn>
    );
};

export default BackToTop;
