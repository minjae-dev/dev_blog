import { useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { colors } from "../../Styles/theme.styles";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Wrap = styled.div`
    background: linear-gradient(135deg, ${colors.accent}0d, ${colors.accent}1a);
    border: 1px solid ${colors.accent}30;
    border-left: 3px solid ${colors.accent};
    border-radius: 10px;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
    animation: ${fadeIn} 0.4s ease;
`;

const QuoteText = styled.p`
    font-size: 0.9rem;
    font-style: italic;
    color: ${colors.text};
    line-height: 1.65;
    margin-bottom: 0.4rem;
`;

const QuoteAuthor = styled.p`
    font-size: 0.75rem;
    font-weight: 600;
    color: ${colors.accent};
    letter-spacing: 0.02em;
`;

const QUOTES = [
    { text: "공부는 생각하는 것처럼 어렵지 않다. 단지 매일 하면 된다.", author: "Anonymous" },
    { text: "배움에는 끝이 없다. 지식은 끝없는 여정이다.", author: "공자" },
    { text: "오늘의 땀이 내일의 실력이 된다.", author: "Anonymous" },
    { text: "이해하지 못한 채 외우는 것은 뇌에 남지 않는다. 개념을 쌓아야 한다.", author: "Richard Feynman" },
    { text: "컴퓨터 과학은 컴퓨터에 관한 것이 아니다. 천문학이 망원경에 관한 것이 아닌 것처럼.", author: "Edsger W. Dijkstra" },
    { text: "코드를 짜는 시간보다 읽히는 코드를 짜는 데 더 많은 시간을 써라.", author: "Robert C. Martin" },
    { text: "단순함은 최고의 정교함이다.", author: "Leonardo da Vinci" },
    { text: "모든 전문가는 한때 초보자였다. 포기하지 말자.", author: "Anonymous" },
    { text: "어제보다 나은 오늘, 오늘보다 나은 내일을 만들어 가자.", author: "Anonymous" },
    { text: "지식이란 책에서 읽은 것이 아니라 직접 해보며 얻는 것이다.", author: "Anonymous" },
    { text: "실수를 두려워 말라. 실수에서 배우는 것이 진짜 학습이다.", author: "Anonymous" },
    { text: "프로그래밍은 생각하는 방법을 가르친다.", author: "Steve Jobs" },
];

const StudyQuote = () => {
    const quote = useMemo(() => {
        const day = new Date().getDate();
        return QUOTES[day % QUOTES.length];
    }, []);

    return (
        <Wrap>
            <QuoteText>"{quote.text}"</QuoteText>
            <QuoteAuthor>— {quote.author}</QuoteAuthor>
        </Wrap>
    );
};

export default StudyQuote;
