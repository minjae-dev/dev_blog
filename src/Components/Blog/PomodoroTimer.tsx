import { useState, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import { colors } from "../../Styles/theme.styles";

const WORK_MIN = 25;
const SHORT_BREAK_MIN = 5;
const LONG_BREAK_MIN = 15;

type Mode = "work" | "short" | "long";

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const Card = styled.div`
    background: var(--c-bg);
    border: 1px solid ${colors.border};
    border-radius: 14px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1.5rem;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
    font-size: 0.85rem;
    font-weight: 700;
    color: ${colors.textMuted};
    letter-spacing: 0.04em;
`;

const ModeRow = styled.div`
    display: flex;
    gap: 0.4rem;
`;

const ModeBtn = styled.button<{ $active: boolean }>`
    font-size: 0.72rem;
    font-weight: 600;
    padding: 0.2rem 0.65rem;
    border-radius: 12px;
    border: 1px solid ${({ $active }) => ($active ? colors.accent : colors.border)};
    color: ${({ $active }) => ($active ? colors.accent : colors.textMuted)};
    background: ${({ $active }) => ($active ? colors.accentLight : "transparent")};
    transition: all 0.15s;

    &:hover {
        border-color: ${colors.accent};
        color: ${colors.accent};
        background: ${colors.accentLight};
    }
`;

const TimerDisplay = styled.div<{ $running: boolean; $mode: Mode }>`
    font-size: 3.5rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    text-align: center;
    color: ${({ $mode }) =>
        $mode === "work"
            ? colors.text
            : $mode === "short"
            ? colors.success
            : colors.accent};
    padding: 0.5rem 0 1rem;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    ${({ $running }) =>
        $running &&
        css`
            animation: ${pulse} 2s ease-in-out infinite;
        `}
`;

const Controls = styled.div`
    display: flex;
    gap: 0.5rem;
    justify-content: center;
`;

const CtrlBtn = styled.button<{ $primary?: boolean }>`
    padding: 0.5rem 1.5rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    border: 1px solid ${({ $primary }) => ($primary ? colors.accent : colors.border)};
    color: ${({ $primary }) => ($primary ? "#fff" : colors.textMuted)};
    background: ${({ $primary }) => ($primary ? colors.accent : "transparent")};
    transition: all 0.15s;

    &:hover {
        opacity: 0.85;
    }
`;

const ProgressBar = styled.div<{ $pct: number; $mode: Mode }>`
    height: 3px;
    background: ${colors.border};
    border-radius: 2px;
    margin-top: 1rem;
    overflow: hidden;

    &::after {
        content: "";
        display: block;
        height: 100%;
        width: ${({ $pct }) => $pct}%;
        background: ${({ $mode }) =>
            $mode === "work"
                ? colors.accent
                : $mode === "short"
                ? colors.success
                : "#a855f7"};
        border-radius: 2px;
        transition: width 0.5s linear;
    }
`;

const SessionCount = styled.div`
    text-align: center;
    font-size: 0.72rem;
    color: ${colors.textLight};
    margin-top: 0.5rem;
`;

const TOTAL_SECS: Record<Mode, number> = {
    work: WORK_MIN * 60,
    short: SHORT_BREAK_MIN * 60,
    long: LONG_BREAK_MIN * 60,
};

const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const PomodoroTimer = () => {
    const [mode, setMode] = useState<Mode>("work");
    const [secs, setSecs] = useState(TOTAL_SECS.work);
    const [running, setRunning] = useState(false);
    const [sessions, setSessions] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!running) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }
        timerRef.current = setInterval(() => {
            setSecs((s) => {
                if (s <= 1) {
                    clearInterval(timerRef.current!);
                    setRunning(false);
                    if (mode === "work") {
                        setSessions((n) => n + 1);
                        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
                            new Notification("🍅 집중 완료!", { body: "잠깐 쉬어가세요." });
                        }
                    }
                    return 0;
                }
                return s - 1;
            });
        }, 1000);

        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [running, mode]);

    const handleMode = (m: Mode) => {
        setMode(m);
        setSecs(TOTAL_SECS[m]);
        setRunning(false);
    };

    const handleReset = () => {
        setSecs(TOTAL_SECS[mode]);
        setRunning(false);
    };

    const pct = ((TOTAL_SECS[mode] - secs) / TOTAL_SECS[mode]) * 100;

    return (
        <Card>
            <Header>
                <CardTitle>🍅 집중 타이머</CardTitle>
                <ModeRow>
                    <ModeBtn $active={mode === "work"} onClick={() => handleMode("work")}>집중</ModeBtn>
                    <ModeBtn $active={mode === "short"} onClick={() => handleMode("short")}>짧은 휴식</ModeBtn>
                    <ModeBtn $active={mode === "long"} onClick={() => handleMode("long")}>긴 휴식</ModeBtn>
                </ModeRow>
            </Header>

            <TimerDisplay $running={running} $mode={mode}>
                {fmt(secs)}
            </TimerDisplay>

            <Controls>
                <CtrlBtn onClick={handleReset}>초기화</CtrlBtn>
                <CtrlBtn $primary onClick={() => setRunning((r) => !r)}>
                    {running ? "일시정지" : secs === TOTAL_SECS[mode] ? "시작" : "재개"}
                </CtrlBtn>
            </Controls>

            <ProgressBar $pct={pct} $mode={mode} />
            <SessionCount>
                {sessions > 0 ? `오늘 ${sessions}회 집중 완료 🎉` : "타이머를 시작해 집중해보세요"}
            </SessionCount>
        </Card>
    );
};

export default PomodoroTimer;
