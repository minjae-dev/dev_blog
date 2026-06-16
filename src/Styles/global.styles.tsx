import { createGlobalStyle } from "styled-components";
import { colors } from "./theme.styles";

export const GlobalStyle = createGlobalStyle`
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
    background-color: ${colors.bg};
    color: ${colors.text};
    line-height: 1.6;
    min-height: 100vh;
  }

  a { color: inherit; text-decoration: none; }
  button { cursor: pointer; border: none; background: none; font-family: inherit; }
  input, textarea, select { font-family: inherit; }
  img { max-width: 100%; display: block; }

  /* ── Toast UI Viewer / Editor content ── */
  .toastui-editor-contents {
    font-family: 'Inter', -apple-system, sans-serif !important;
    font-size: 1rem !important;
    line-height: 1.8 !important;
    color: ${colors.text} !important;
    word-break: break-word !important;
  }

  .toastui-editor-contents h1,
  .toastui-editor-contents h2,
  .toastui-editor-contents h3,
  .toastui-editor-contents h4 {
    font-weight: 600 !important;
    color: ${colors.text} !important;
    margin-top: 2rem !important;
    margin-bottom: 0.75rem !important;
    line-height: 1.3 !important;
  }

  .toastui-editor-contents h1 { font-size: 1.75rem !important; border-bottom: 1px solid ${colors.border} !important; padding-bottom: 0.4rem !important; }
  .toastui-editor-contents h2 { font-size: 1.4rem !important; }
  .toastui-editor-contents h3 { font-size: 1.15rem !important; }

  .toastui-editor-contents p { margin-bottom: 1rem !important; }

  .toastui-editor-contents code {
    font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
    font-size: 0.85em !important;
    background: #f0f0f5 !important;
    border: 1px solid ${colors.border} !important;
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
    border-left: 3px solid ${colors.accent} !important;
    margin: 1.25rem 0 !important;
    padding: 0.6rem 1rem !important;
    background: ${colors.accentLight} !important;
    border-radius: 0 6px 6px 0 !important;
    color: ${colors.textMuted} !important;
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
    color: ${colors.accent} !important;
    text-decoration: underline !important;
  }

  .toastui-editor-contents hr {
    border: none !important;
    border-top: 1px solid ${colors.border} !important;
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
    border: 1px solid ${colors.border} !important;
    padding: 0.6rem 0.9rem !important;
    text-align: left !important;
  }

  .toastui-editor-contents th {
    background: ${colors.bgAlt} !important;
    font-weight: 600 !important;
  }

  /* Editor UI */
  .toastui-editor-defaultUI {
    border: 1px solid ${colors.border} !important;
    border-radius: 10px !important;
    overflow: hidden !important;
  }

  .toastui-editor-toolbar {
    border-bottom: 1px solid ${colors.border} !important;
    background: ${colors.bgAlt} !important;
    padding: 4px 8px !important;
  }

  .toastui-editor-main-container {
    font-family: 'Inter', sans-serif !important;
  }

  .toastui-editor-ww-container,
  .toastui-editor-md-container {
    background: ${colors.bg} !important;
  }

  .ProseMirror, .toastui-editor .CodeMirror {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 0.9rem !important;
    line-height: 1.7 !important;
    padding: 1rem 1.5rem !important;
  }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${colors.textLight}; }
`;

export default GlobalStyle;
