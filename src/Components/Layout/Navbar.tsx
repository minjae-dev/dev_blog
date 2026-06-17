import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { colors, media, shadows } from "../../Styles/theme.styles";
import { RootState } from "../../Stores/store-config";
import { logout } from "../../Stores/authSlice";
import { useTheme } from "../../Context/ThemeContext";
import SearchModal from "../Blog/SearchModal";

const fadeDown = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Nav = styled.nav`
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--c-nav-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid ${colors.border};
    box-shadow: ${shadows.nav};
    transition: background 0.2s ease;
`;

const Inner = styled.div`
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5rem;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
`;

const Logo = styled(Link)`
    font-size: 1.05rem;
    font-weight: 700;
    color: ${colors.text};
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;

    span { color: ${colors.accent}; }
`;

const NavLinks = styled.div`
    display: flex;
    align-items: center;
    gap: 0.25rem;

    ${media.mobile} { display: none; }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: ${({ $active }) => ($active ? "600" : "400")};
    color: ${({ $active }) => ($active ? colors.accent : colors.textMuted)};
    background: ${({ $active }) => ($active ? colors.accentLight : "transparent")};
    transition: all 0.15s ease;

    &:hover {
        background: ${colors.bgAlt};
        color: ${colors.text};
    }
`;

const RightGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
`;

const IconBtn = styled.button<{ $active?: boolean }>`
    width: 34px;
    height: 34px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
    color: ${({ $active }) => ($active ? colors.accent : colors.textMuted)};
    background: ${({ $active }) => ($active ? colors.accentLight : "transparent")};
    border: 1px solid ${({ $active }) => ($active ? colors.accent : colors.border)};
    transition: all 0.15s ease;
    position: relative;

    &:hover {
        background: ${colors.bgAlt};
        color: ${colors.text};
    }
`;

const Badge = styled.span`
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 16px;
    height: 16px;
    border-radius: 8px;
    background: ${colors.accent};
    color: #fff;
    font-size: 0.6rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 3px;
    line-height: 1;
`;

const WriteBtn = styled(Link)`
    padding: 0.45rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #fff;
    background: ${colors.accent};
    transition: background 0.15s ease;

    &:hover { background: ${colors.accentHover}; }

    ${media.mobile} {
        padding: 0.4rem 0.75rem;
        font-size: 0.8rem;
    }
`;

const LogoutBtn = styled.button`
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
    color: ${colors.textMuted};
    background: transparent;
    border: 1px solid ${colors.border};
    transition: all 0.15s ease;

    &:hover {
        background: ${colors.bgAlt};
        color: ${colors.danger};
        border-color: ${colors.danger};
    }

    ${media.mobile} { display: none; }
`;

const LoginBtn = styled(Link)`
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
    color: ${colors.textMuted};
    background: transparent;
    border: 1px solid ${colors.border};
    transition: all 0.15s ease;

    &:hover {
        background: ${colors.bgAlt};
        color: ${colors.text};
    }
`;

const ShortcutsPanel = styled.div`
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: var(--c-bg);
    border: 1px solid ${colors.border};
    border-radius: 10px;
    padding: 0.75rem 1rem;
    min-width: 220px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    animation: ${fadeDown} 0.15s ease;
    z-index: 200;
`;

const ShortcutsTitle = styled.p`
    font-size: 0.7rem;
    font-weight: 700;
    color: ${colors.textMuted};
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 0.6rem;
`;

const ShortcutRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.25rem 0;
    font-size: 0.78rem;
`;

const ShortcutLabel = styled.span`
    color: ${colors.textMuted};
`;

const Kbd = styled.kbd`
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    font-family: monospace;
    font-size: 0.7rem;
    font-weight: 600;
    color: ${colors.text};
    background: ${colors.bgAlt};
    border: 1px solid ${colors.border};
    border-radius: 4px;
    padding: 0.15em 0.45em;
`;

const RelativeWrap = styled.div`
    position: relative;
`;

const HamburgerBtn = styled.button`
    display: none;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    color: ${colors.textMuted};
    background: transparent;
    border: 1px solid ${colors.border};
    cursor: pointer;
    transition: all 0.15s;

    &:hover {
        background: ${colors.bgAlt};
        color: ${colors.text};
    }

    ${media.mobile} { display: flex; }
`;

const MobileMenu = styled.div`
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--c-nav-bg);
    border-bottom: 1px solid ${colors.border};
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    padding: 0.75rem 1.5rem 1rem;
    animation: ${slideDown} 0.15s ease;
    z-index: 90;
    flex-direction: column;
    gap: 0.25rem;

    ${media.mobile} { display: flex; }
`;

const MobileNavLink = styled(Link)<{ $active?: boolean }>`
    display: block;
    padding: 0.7rem 0.75rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: ${({ $active }) => ($active ? "600" : "400")};
    color: ${({ $active }) => ($active ? colors.accent : colors.text)};
    background: ${({ $active }) => ($active ? colors.accentLight : "transparent")};
    transition: all 0.15s;

    &:hover {
        background: ${colors.bgAlt};
    }
`;

const MobileDivider = styled.div`
    height: 1px;
    background: ${colors.border};
    margin: 0.5rem 0;
`;

const MobileLogoutBtn = styled.button`
    text-align: left;
    padding: 0.7rem 0.75rem;
    border-radius: 8px;
    font-size: 0.9rem;
    color: ${colors.danger};
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.15s;
    width: 100%;

    &:hover { background: ${colors.bgAlt}; }
`;

const SHORTCUTS = [
    { label: "검색 포커스", key: "⌘ K" },
    { label: "새 글 작성", key: "⌘ N" },
    { label: "홈으로", key: "H" },
    { label: "글 목록", key: "P" },
    { label: "뒤로 가기", key: "Esc" },
    { label: "글 저장 (작성 중)", key: "⌘ S" },
];

const Navbar = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isDark, toggleTheme } = useTheme();
    const { isAuthenticated, username } = useSelector((s: RootState) => s.auth);
    const bookmarkCount = useSelector((s: RootState) => s.bookmarks.ids.length);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showMobile, setShowMobile] = useState(false);

    const handleSearchKeydown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "Enter" || e.key === " ") setShowSearch(true);
    };

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setShowSearch(true);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    useEffect(() => {
        setShowMobile(false);
    }, [pathname]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    return (
        <>
        {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
        <Nav style={{ position: "sticky" }}>
            <Inner>
                <Logo to="/">
                    CS<span>Log</span>
                </Logo>
                <NavLinks>
                    <NavLink to="/" $active={pathname === "/"}>
                        홈
                    </NavLink>
                    <NavLink to="/posts" $active={pathname === "/posts"}>
                        글 목록
                    </NavLink>
                    <NavLink to="/posts?bookmarks=1" $active={false}>
                        즐겨찾기
                        {bookmarkCount > 0 && (
                            <span
                                style={{
                                    marginLeft: "0.3rem",
                                    fontSize: "0.65rem",
                                    fontWeight: 700,
                                    color: colors.accent,
                                }}
                            >
                                {bookmarkCount}
                            </span>
                        )}
                    </NavLink>
                    {isAuthenticated && (
                        <NavLink to="/settings" $active={pathname === "/settings"}>
                            설정
                        </NavLink>
                    )}
                </NavLinks>
                <RightGroup>
                    <IconBtn
                        onClick={() => setShowSearch(true)}
                        onKeyDown={handleSearchKeydown}
                        title="검색 (⌘K)"
                        aria-label="검색"
                    >
                        🔍
                    </IconBtn>
                    <RelativeWrap>
                        <IconBtn
                            onClick={() => setShowShortcuts((v) => !v)}
                            title="키보드 단축키"
                        >
                            ⌨️
                        </IconBtn>
                        {showShortcuts && (
                            <>
                                <div
                                    style={{
                                        position: "fixed",
                                        inset: 0,
                                        zIndex: 199,
                                    }}
                                    onClick={() => setShowShortcuts(false)}
                                />
                                <ShortcutsPanel>
                                    <ShortcutsTitle>키보드 단축키</ShortcutsTitle>
                                    {SHORTCUTS.map((s) => (
                                        <ShortcutRow key={s.label}>
                                            <ShortcutLabel>{s.label}</ShortcutLabel>
                                            <Kbd>{s.key}</Kbd>
                                        </ShortcutRow>
                                    ))}
                                </ShortcutsPanel>
                            </>
                        )}
                    </RelativeWrap>
                    <IconBtn onClick={toggleTheme} title={isDark ? "라이트 모드" : "다크 모드"}>
                        {isDark ? "☀️" : "🌙"}
                    </IconBtn>
                    {isAuthenticated ? (
                        <>
                            <WriteBtn to="/write">+ 새 글</WriteBtn>
                            <LogoutBtn onClick={handleLogout} title={`${username} 로그아웃`}>
                                로그아웃
                            </LogoutBtn>
                        </>
                    ) : (
                        <LoginBtn to="/login">로그인</LoginBtn>
                    )}
                    <HamburgerBtn
                        onClick={() => setShowMobile((v) => !v)}
                        aria-label="메뉴"
                    >
                        {showMobile ? "✕" : "☰"}
                    </HamburgerBtn>
                </RightGroup>
            </Inner>
            {showMobile && (
                <MobileMenu>
                    <MobileNavLink to="/" $active={pathname === "/"}>🏠 홈</MobileNavLink>
                    <MobileNavLink to="/posts" $active={pathname === "/posts"}>📄 글 목록</MobileNavLink>
                    <MobileNavLink to="/posts?bookmarks=1" $active={false}>
                        ★ 즐겨찾기 {bookmarkCount > 0 ? `(${bookmarkCount})` : ""}
                    </MobileNavLink>
                    {isAuthenticated && (
                        <>
                            <MobileNavLink to="/write" $active={pathname === "/write"}>✏️ 새 글 작성</MobileNavLink>
                            <MobileNavLink to="/settings" $active={pathname === "/settings"}>⚙️ 설정</MobileNavLink>
                            <MobileDivider />
                            <MobileLogoutBtn onClick={handleLogout}>
                                🚪 로그아웃 ({username})
                            </MobileLogoutBtn>
                        </>
                    )}
                    {!isAuthenticated && (
                        <MobileNavLink to="/login">🔑 로그인</MobileNavLink>
                    )}
                </MobileMenu>
            )}
        </Nav>
        </>
    );
};

export default Navbar;
