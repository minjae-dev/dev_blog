import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    --c-bg: #ffffff;
    --c-bg-alt: #f6f8fa;
    --c-border: #e1e4e8;
    --c-border-light: #f0f0f0;
    --c-text: #1a1a2e;
    --c-text-muted: #586069;
    --c-text-light: #8b949e;
    --c-accent: #0070f3;
    --c-accent-hover: #005ce6;
    --c-accent-light: #e8f0fe;
    --c-danger: #dc3545;
    --c-heatmap-empty: #ebedf0;
    --c-heatmap-l1: #9be9a8;
    --c-heatmap-l2: #40c463;
    --c-heatmap-l3: #30a14e;
    --c-heatmap-l4: #216e39;
    --c-nav-bg: rgba(255,255,255,0.92);
  }

  [data-theme="dark"] {
    --c-bg: #0d1117;
    --c-bg-alt: #161b22;
    --c-border: #30363d;
    --c-border-light: #21262d;
    --c-text: #e6edf3;
    --c-text-muted: #8b949e;
    --c-text-light: #6e7681;
    --c-accent: #58a6ff;
    --c-accent-hover: #79b8ff;
    --c-accent-light: #0d1f36;
    --c-danger: #f85149;
    --c-heatmap-empty: #161b22;
    --c-heatmap-l1: #0e4429;
    --c-heatmap-l2: #006d32;
    --c-heatmap-l3: #26a641;
    --c-heatmap-l4: #39d353;
    --c-nav-bg: rgba(13,17,23,0.92);
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background-color: var(--c-bg);
    color: var(--c-text);
    line-height: 1.6;
    min-height: 100vh;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; border: none; background: none; font-family: inherit; }
  input, textarea, select { font-family: inherit; }
  img { max-width: 100%; display: block; }

  /* ── Toast UI content ── */
  .toastui-editor-contents {
    font-family: 'Inter', -apple-system, sans-serif !important;
    font-size: 1rem !important;
    line-height: 1.8 !important;
    color: var(--c-text) !important;
    word-break: break-word !important;
  }

  .toastui-editor-contents h1,
  .toastui-editor-contents h2,
  .toastui-editor-contents h3,
  .toastui-editor-contents h4 {
    font-weight: 600 !important;
    color: var(--c-text) !important;
    margin-top: 2rem !important;
    margin-bottom: 0.75rem !important;
    line-height: 1.3 !important;
  }

  .toastui-editor-contents h1 { font-size: 1.75rem !important; border-bottom: 1px solid var(--c-border) !important; padding-bottom: 0.4rem !important; }
  .toastui-editor-contents h2 { font-size: 1.4rem !important; }
  .toastui-editor-contents h3 { font-size: 1.15rem !important; }

  .toastui-editor-contents p { margin-bottom: 1rem !important; }

  .toastui-editor-contents code {
    font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
    font-size: 0.85em !important;
    background: var(--c-bg-alt) !important;
    border: 1px solid var(--c-border) !important;
    border-radius: 4px !important;
    padding: 0.15em 0.45em !important;
    color: #d63384 !important;
  }

  .toastui-editor-contents pre {
    background: #1e1e2e !important;
    border-radius: 10px !important;
    padding: 1.25rem 1.5rem !important;
    margin: 1.25rem 0 !important;
    overflow-x: auto !important;
  }

  .toastui-editor-contents pre code {
    font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
    font-size: 0.875rem !important;
    line-height: 1.65 !important;
    color: #cdd6f4 !important;
    background: none !important;
    border: none !important;
    padding: 0 !important;
  }

  .toastui-editor-contents blockquote {
    border-left: 3px solid var(--c-accent) !important;
    margin: 1.25rem 0 !important;
    padding: 0.6rem 1rem !important;
    background: var(--c-accent-light) !important;
    border-radius: 0 6px 6px 0 !important;
    color: var(--c-text-muted) !important;
  }

  .toastui-editor-contents ul,
  .toastui-editor-contents ol {
    margin: 0.75rem 0 !important;
    padding-left: 1.5rem !important;
    list-style: initial !important;
  }

  .toastui-editor-contents ol { list-style: decimal !important; }
  .toastui-editor-contents li { margin-bottom: 0.35rem !important; }

  .toastui-editor-contents a {
    color: var(--c-accent) !important;
    text-decoration: underline !important;
  }

  .toastui-editor-contents hr {
    border: none !important;
    border-top: 1px solid var(--c-border) !important;
    margin: 2rem 0 !important;
  }

  .toastui-editor-contents table {
    width: 100% !important;
    border-collapse: collapse !important;
    margin: 1.25rem 0 !important;
    font-size: 0.9rem !important;
  }

  .toastui-editor-contents th,
  .toastui-editor-contents td {
    border: 1px solid var(--c-border) !important;
    padding: 0.6rem 0.9rem !important;
    text-align: left !important;
  }

  .toastui-editor-contents th {
    background: var(--c-bg-alt) !important;
    font-weight: 600 !important;
  }

  .toastui-editor-defaultUI {
    border: 1px solid var(--c-border) !important;
    border-radius: 10px !important;
    overflow: hidden !important;
  }

  .toastui-editor-toolbar {
    border-bottom: 1px solid var(--c-border) !important;
    background: var(--c-bg-alt) !important;
    padding: 4px 8px !important;
  }

  .toastui-editor-main-container {
    font-family: 'Inter', sans-serif !important;
  }

  .toastui-editor-ww-container,
  .toastui-editor-md-container {
    background: var(--c-bg) !important;
  }

  .ProseMirror, .toastui-editor .CodeMirror {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 0.9rem !important;
    line-height: 1.7 !important;
    padding: 1rem 1.5rem !important;
  }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--c-border); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--c-text-light); }
`;

export default GlobalStyle;
