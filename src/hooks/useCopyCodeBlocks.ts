import { useEffect } from "react";

const useCopyCodeBlocks = (contentRef: HTMLElement | null) => {
    useEffect(() => {
        if (!contentRef) return;

        const preBlocks = contentRef.querySelectorAll<HTMLElement>("pre");
        const cleanups: (() => void)[] = [];

        preBlocks.forEach((pre) => {
            if (pre.querySelector(".copy-btn")) return;

            pre.style.position = "relative";

            const btn = document.createElement("button");
            btn.textContent = "복사";
            btn.className = "copy-btn";
            btn.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                padding: 3px 10px;
                font-size: 11px;
                font-weight: 600;
                font-family: inherit;
                color: #94a3b8;
                background: rgba(255,255,255,0.08);
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.15s;
                z-index: 10;
                letter-spacing: 0.02em;
            `;

            const handleClick = async () => {
                const code = pre.querySelector("code")?.textContent ?? pre.textContent ?? "";
                try {
                    await navigator.clipboard.writeText(code);
                    btn.textContent = "✓ 복사됨";
                    btn.style.color = "#4ade80";
                    btn.style.borderColor = "rgba(74,222,128,0.3)";
                    setTimeout(() => {
                        btn.textContent = "복사";
                        btn.style.color = "#94a3b8";
                        btn.style.borderColor = "rgba(255,255,255,0.12)";
                    }, 2000);
                } catch {
                    btn.textContent = "실패";
                    setTimeout(() => { btn.textContent = "복사"; }, 1500);
                }
            };

            btn.addEventListener("mouseenter", () => {
                btn.style.background = "rgba(255,255,255,0.14)";
                btn.style.color = "#cbd5e1";
            });
            btn.addEventListener("mouseleave", () => {
                if (btn.textContent === "복사") {
                    btn.style.background = "rgba(255,255,255,0.08)";
                    btn.style.color = "#94a3b8";
                }
            });

            btn.addEventListener("click", handleClick);
            pre.appendChild(btn);

            cleanups.push(() => {
                btn.removeEventListener("click", handleClick);
                btn.remove();
            });
        });

        return () => cleanups.forEach((fn) => fn());
    });
};

export default useCopyCodeBlocks;
