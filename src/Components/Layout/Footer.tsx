import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Stores/store-config";
import { colors, media } from "../../Styles/theme.styles";

const FooterEl = styled.footer`
    border-top: 1px solid ${colors.border};
    margin-top: auto;
    background: var(--c-bg);
`;

const Inner = styled.div`
    max-width: 860px;
    margin: 0 auto;
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;

    ${media.mobile} {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
`;

const Left = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
`;

const Logo = styled(Link)`
    font-size: 0.88rem;
    font-weight: 700;
    color: ${colors.text};
    letter-spacing: -0.02em;

    span { color: ${colors.accent}; }
`;

const Stat = styled.span`
    font-size: 0.72rem;
    color: ${colors.textLight};
    padding: 0.15rem 0.6rem;
    background: ${colors.bgAlt};
    border-radius: 20px;
    border: 1px solid ${colors.border};
`;

const Right = styled.p`
    font-size: 0.75rem;
    color: ${colors.textLight};
`;

const Footer = () => {
    const posts = useSelector((s: RootState) => s.posts.posts);
    const username = useSelector((s: RootState) => s.auth.username);
    const totalViews = useSelector((s: RootState) =>
        Object.values(s.views.counts).reduce((a, b) => a + b, 0)
    );

    const thisYear = posts.filter(
        (p) => new Date(p.createdAt).getFullYear() === new Date().getFullYear()
    ).length;

    const tagCount = new Set(posts.flatMap((p) => p.tags)).size;

    return (
        <FooterEl>
            <Inner>
                <Left>
                    <Logo to="/">CS<span>Log</span></Logo>
                    {posts.length > 0 && (
                        <>
                            <Stat>✍️ 총 {posts.length}편 · 올해 {thisYear}편</Stat>
                            {tagCount > 0 && <Stat>🏷️ {tagCount}개 태그</Stat>}
                            {totalViews > 0 && <Stat>👀 {totalViews}회 조회</Stat>}
                        </>
                    )}
                </Left>
                <Right>
                    {username ? `${username}의 학습 기록` : "개인 CS 학습 일지"} · {new Date().getFullYear()}
                </Right>
            </Inner>
        </FooterEl>
    );
};

export default Footer;
