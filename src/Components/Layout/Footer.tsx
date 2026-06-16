import styled from "styled-components";
import { colors, media } from "../../Styles/theme.styles";

const FooterEl = styled.footer`
    border-top: 1px solid ${colors.border};
    padding: 2rem 1.5rem;
    margin-top: 4rem;
    background: ${colors.bg};
`;

const Inner = styled.div`
    max-width: 860px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;

    ${media.mobile} {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
    }
`;

const Text = styled.p`
    font-size: 0.8rem;
    color: ${colors.textLight};
`;

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <FooterEl>
            <Inner>
                <Text>CS Study Log — A personal learning journal</Text>
                <Text>© {year}</Text>
            </Inner>
        </FooterEl>
    );
};

export default Footer;
