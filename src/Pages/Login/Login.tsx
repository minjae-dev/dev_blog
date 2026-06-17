import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { setup, login } from "../../Stores/authSlice";
import { RootState } from "../../Stores/store-config";
import { colors, media } from "../../Styles/theme.styles";

const Page = styled.main`
    min-height: calc(100vh - 120px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
`;

const Card = styled.div`
    width: 100%;
    max-width: 400px;
    background: var(--c-bg);
    border: 1px solid ${colors.border};
    border-radius: 16px;
    padding: 2.5rem 2rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);

    ${media.mobile} {
        padding: 2rem 1.5rem;
    }
`;

const Logo = styled.div`
    font-size: 1.3rem;
    font-weight: 700;
    color: ${colors.text};
    letter-spacing: -0.02em;
    margin-bottom: 0.4rem;

    span {
        color: ${colors.accent};
    }
`;

const Subtitle = styled.p`
    font-size: 0.875rem;
    color: ${colors.textMuted};
    margin-bottom: 2rem;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
`;

const Label = styled.label`
    font-size: 0.78rem;
    font-weight: 600;
    color: ${colors.textMuted};
    letter-spacing: 0.05em;
    text-transform: uppercase;
`;

const Input = styled.input`
    padding: 0.7rem 1rem;
    border: 1px solid ${colors.border};
    border-radius: 8px;
    font-size: 0.95rem;
    color: ${colors.text};
    background: var(--c-bg);
    outline: none;
    transition: border-color 0.15s;

    &::placeholder {
        color: ${colors.textLight};
    }

    &:focus {
        border-color: ${colors.accent};
        box-shadow: 0 0 0 3px ${colors.accentLight};
    }
`;

const SubmitBtn = styled.button`
    margin-top: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    border: none;
    color: #fff;
    background: ${colors.accent};
    transition: background 0.15s;
    width: 100%;

    &:hover {
        background: ${colors.accentHover};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const ErrorMsg = styled.p`
    font-size: 0.82rem;
    color: ${colors.danger};
    text-align: center;
`;

const Divider = styled.div`
    height: 1px;
    background: ${colors.border};
    margin: 1.5rem 0;
`;

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isSetup = useSelector((s: RootState) => s.auth.isSetup);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!isSetup) {
            if (!username.trim()) { setError("블로그 이름을 입력해주세요."); return; }
            if (password.length < 4) { setError("비밀번호는 4자 이상이어야 합니다."); return; }
            if (password !== confirm) { setError("비밀번호가 일치하지 않습니다."); return; }
            dispatch(setup({ username: username.trim(), password }));
            navigate("/");
        } else {
            if (!password) { setError("비밀번호를 입력해주세요."); return; }
            const result = dispatch(login({ password }));
            const stored = localStorage.getItem("cs_blog_pw") ?? "";
            if (password !== stored) {
                setError("비밀번호가 틀렸습니다.");
                return;
            }
            navigate("/");
        }
    };

    return (
        <Page>
            <Card>
                <Logo>
                    CS<span>Log</span>
                </Logo>
                {!isSetup ? (
                    <Subtitle>처음 방문이시군요! 블로그 이름과 비밀번호를 설정해주세요.</Subtitle>
                ) : (
                    <Subtitle>로그인하여 글을 작성하고 관리하세요.</Subtitle>
                )}

                <Form onSubmit={handleSubmit}>
                    {!isSetup && (
                        <Field>
                            <Label>블로그 이름 (닉네임)</Label>
                            <Input
                                type="text"
                                placeholder="예: 개발하는 김씨"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoFocus
                            />
                        </Field>
                    )}

                    <Field>
                        <Label>비밀번호</Label>
                        <Input
                            type="password"
                            placeholder={!isSetup ? "4자 이상 입력" : "비밀번호 입력"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus={isSetup}
                        />
                    </Field>

                    {!isSetup && (
                        <Field>
                            <Label>비밀번호 확인</Label>
                            <Input
                                type="password"
                                placeholder="비밀번호 재입력"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                            />
                        </Field>
                    )}

                    {error && <ErrorMsg>{error}</ErrorMsg>}

                    <SubmitBtn type="submit">
                        {!isSetup ? "블로그 시작하기" : "로그인"}
                    </SubmitBtn>
                </Form>

                <Divider />
                <p style={{ fontSize: "0.75rem", color: colors.textLight, textAlign: "center" }}>
                    글 읽기는 로그인 없이 가능합니다
                </p>
            </Card>
        </Page>
    );
};

export default Login;
