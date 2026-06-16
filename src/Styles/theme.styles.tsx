export const colors = {
    bg: "#ffffff",
    bgAlt: "#f6f8fa",
    bgCode: "#1e1e2e",
    border: "#e1e4e8",
    borderLight: "#f0f0f0",
    text: "#1a1a2e",
    textMuted: "#586069",
    textLight: "#8b949e",
    accent: "#0070f3",
    accentHover: "#005ce6",
    accentLight: "#e8f0fe",
    success: "#28a745",
    danger: "#dc3545",
    heatmap: {
        empty: "#ebedf0",
        l1: "#9be9a8",
        l2: "#40c463",
        l3: "#30a14e",
        l4: "#216e39",
    },
    tag: {
        bg: "#f1f3f4",
        text: "#444d56",
    },
};

export const breakpoints = {
    mobile: "600px",
    tablet: "900px",
    laptop: "1200px",
};

export const media = {
    mobile: `@media (max-width: ${breakpoints.mobile})`,
    tablet: `@media (max-width: ${breakpoints.tablet})`,
    laptop: `@media (max-width: ${breakpoints.laptop})`,
};

export const shadows = {
    card: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
    cardHover: "0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
    nav: "0 1px 0 rgba(0,0,0,0.06)",
};

const theme = { colors, breakpoints, media, shadows };
export default theme;
