import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { colors, media, shadows } from "../../Styles/theme.styles";
import { RootState } from "../../Stores/store-config";
import { logout } from "../../Stores/authSlice";
import { useTheme } from "../../Context/ThemeContext";

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
    max-width: 860px;
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

    span {
        color: ${colors.accent};
    }
`;

const NavLinks = styled.div`
    display: flex;
    align-items: center;
    gap: 0.25rem;

    ${media.mobile} {
        gap: 0.1rem;
    }
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

    ${media.mobile} {
        padding: 0.35rem 0.6rem;
        font-size: 0.8rem;
    }
`;

const RightGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
`;

const IconBtn = styled.button`
    width: 34px;
    height: 34px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    color: ${colors.textMuted};
    background: transparent;
    border: 1px solid ${colors.border};
    transition: all 0.15s ease;

    &:hover {
        background: ${colors.bgAlt};
        color: ${colors.text};
    }
`;

const WriteBtn = styled(Link)`
    padding: 0.45rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #fff;
    background: ${colors.accent};
    transition: background 0.15s ease;

    &:hover {
        background: ${colors.accentHover};
    }

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

const Navbar = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isDark, toggleTheme } = useTheme();
    const { isAuthenticated, username } = useSelector((s: RootState) => s.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    return (
        <Nav>
            <Inner>
                <Logo to="/">
                    CS<span>Log</span>
                </Logo>
                <NavLinks>
                    <NavLink to="/" $active={pathname === "/"}>
                        Home
                    </NavLink>
                    <NavLink to="/posts" $active={pathname === "/posts"}>
                        Posts
                    </NavLink>
                </NavLinks>
                <RightGroup>
                    <IconBtn onClick={toggleTheme} title={isDark ? "라이트 모드" : "다크 모드"}>
                        {isDark ? "☀️" : "🌙"}
                    </IconBtn>
                    {isAuthenticated ? (
                        <>
                            <WriteBtn to="/write">+ New Post</WriteBtn>
                            <LogoutBtn onClick={handleLogout} title={`${username} 로그아웃`}>
                                로그아웃
                            </LogoutBtn>
                        </>
                    ) : (
                        <LoginBtn to="/login">로그인</LoginBtn>
                    )}
                </RightGroup>
            </Inner>
        </Nav>
    );
};

export default Navbar;
