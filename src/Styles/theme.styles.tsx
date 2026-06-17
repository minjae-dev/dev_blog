export const colors = {
    bg: "var(--c-bg)",
    bgAlt: "var(--c-bg-alt)",
    bgCode: "#1e1e2e",
    border: "var(--c-border)",
    borderLight: "var(--c-border-light)",
    text: "var(--c-text)",
    textMuted: "var(--c-text-muted)",
    textLight: "var(--c-text-light)",
    accent: "var(--c-accent)",
    accentHover: "var(--c-accent-hover)",
    accentLight: "var(--c-accent-light)",
    success: "#28a745",
    danger: "var(--c-danger)",
    heatmap: {
        empty: "var(--c-heatmap-empty)",
        l1: "var(--c-heatmap-l1)",
        l2: "var(--c-heatmap-l2)",
        l3: "var(--c-heatmap-l3)",
        l4: "var(--c-heatmap-l4)",
    },
    tag: {
        bg: "var(--c-bg-alt)",
        text: "var(--c-text-muted)",
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
