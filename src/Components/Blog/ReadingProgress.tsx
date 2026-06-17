import { useState, useEffect } from "react";
import styled from "styled-components";
import { colors } from "../../Styles/theme.styles";

const Bar = styled.div<{ $pct: number }>`
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    width: ${({ $pct }) => $pct}%;
    background: linear-gradient(90deg, ${colors.accent}, #7c3aed);
    z-index: 200;
    transition: width 0.05s linear;
    border-radius: 0 2px 2px 0;
`;

const ReadingProgress = () => {
    const [pct, setPct] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const el = document.documentElement;
            const scrolled = el.scrollTop || document.body.scrollTop;
            const total = el.scrollHeight - el.clientHeight;
            setPct(total > 0 ? Math.round((scrolled / total) * 100) : 0);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (pct <= 0) return null;
    return <Bar $pct={pct} />;
};

export default ReadingProgress;
