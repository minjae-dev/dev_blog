import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { colors, media, shadows } from "../../Styles/theme.styles";

const Nav = styled.nav`
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid ${colors.border};
    box-shadow: ${shadows.nav};
`;

const Inner = styled.div`
    max-width: 860px;
    margin: 0 auto;
    padding: 0 1.5rem;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
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

const WriteBtn = styled(Link)`
    padding: 0.45rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #fff;
    background: ${colors.accent};
    transition: background 0.15s ease;
    flex-shrink: 0;

    &:hover {
        background: ${colors.accentHover};
    }

    ${media.mobile} {
        padding: 0.4rem 0.75rem;
        font-size: 0.8rem;
    }
`;

const Navbar = () => {
    const { pathname } = useLocation();

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
                <WriteBtn to="/write">+ New Post</WriteBtn>
            </Inner>
        </Nav>
    );
};

export default Navbar;
