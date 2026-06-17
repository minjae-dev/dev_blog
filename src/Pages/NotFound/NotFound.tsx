import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { colors } from "../../Styles/theme.styles";

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
`;

const Page = styled.main`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    padding: 3rem 1.5rem;
    text-align: center;
`;

const Emoji = styled.div`
    font-size: 5rem;
    margin-bottom: 1.25rem;
    animation: ${float} 3s ease-in-out infinite;
`;

const Code = styled.p`
    font-size: 5rem;
    font-weight: 800;
    color: ${colors.accent};
    letter-spacing: -0.05em;
    line-height: 1;
    margin-bottom: 0.5rem;
`;

const Title = styled.h1`
    font-size: 1.5rem;
    font-weight: 700;
    color: ${colors.text};
    margin-bottom: 0.75rem;
`;

const Desc = styled.p`
    font-size: 0.95rem;
    color: ${colors.textMuted};
    max-width: 380px;
    line-height: 1.65;
    margin-bottom: 2rem;
`;

const BackBtn = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1.5rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #fff;
    background: ${colors.accent};
    transition: background 0.15s;

    &:hover { background: ${colors.accentHover}; }
`;

const NotFound = () => (
    <Page>
        <Emoji>📭</Emoji>
        <Code>404</Code>
        <Title>페이지를 찾을 수 없어요</Title>
        <Desc>
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있어요.
            URL을 다시 확인해보거나 홈으로 돌아가세요.
        </Desc>
        <BackBtn to="/">← 홈으로 돌아가기</BackBtn>
    </Page>
);

export default NotFound;
