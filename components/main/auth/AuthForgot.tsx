import { sendPasswordResetEmail, getAuth } from 'firebase/auth';
import { useState } from 'react';
import styled from 'styled-components';

interface Props {
  forgotModalButton: () => void;
}

const AuthForgot = (props: Props): JSX.Element => {
  const [sending, setSending] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const authService = getAuth();

  const resetPasswordRequest = async () => {
    if (error !== '') setError('');

    setSending(true);
    await sendPasswordResetEmail(authService, email)
      .then(() => {
        alert('이메일에 링크를 보냈습니다');
        setSent(true);
        setSending(false);
      })
      .catch((error) => {
        alert('이메일 보내기에 실패하였습니다');
        setError(error.message);
        setSending(false);
      });
  };

  return (
    <ForgotPwContainer onClick={(e) => e.stopPropagation()}>
      <h3>비밀번호를 찾기 위해</h3>
      {sent ? (
        <div>이미 당신의 이메일로 보냈습니다</div>
      ) : (
        <>
          <ForgotText>
            <h3>사용자의 이메일을 입력해주세요</h3>
          </ForgotText>
          <ResetPwForm>
            <ResetPwInput
              type="email"
              name="email"
              id="email"
              placeholder="이메일을 작성해주세요"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </ResetPwForm>
          <ResetPwBtn disabled={sending} onClick={() => resetPasswordRequest()}>
            Send Email
          </ResetPwBtn>
          <ForgotOtherMethod>
            <ForgotOrLine>
              <div>OR</div>
            </ForgotOrLine>
            <LoginReturnContainer onClick={props.forgotModalButton}>
              <LoginReturnDiv>로그인으로 돌아가기</LoginReturnDiv>
            </LoginReturnContainer>
          </ForgotOtherMethod>
        </>
      )}
    </ForgotPwContainer>
  );
};

const ForgotPwContainer = styled.div`
  background-color: white;
  width: 350px;
  height: 200px;
  margin: 0 auto;
  margin-top: 200px;
  padding: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
`;
const ForgotText = styled.div`
  margin-top: 10px;
`;
const ResetPwForm = styled.form`
  margin-top: 20px;
`;
const ResetPwInput = styled.input`
  width: 250px;
  height: 20px;
  padding: 5px;
  border: 2px solid white;
  border-radius: 5px;
`;
const ResetPwBtn = styled.button`
  margin-top: 20px;
  height: 30px;
  width: 130px;
  font-weight: 600;
  border-radius: 10px;
  border: 1px solid white;
  color: Red;
  &:hover {
    border: 3px solid Red;
  }
`;
const ForgotOtherMethod = styled.div``;
const ForgotOrLine = styled.div`
  display: flex;
  flex-basis: 100%;
  align-items: center;
  margin: 25px 25px;
  ::before {
    content: '';
    flex-grow: 1;
    background: rgba(0, 0, 0, 1);
    height: 1px;
    font-size: 0px;
    line-height: 0px;
    margin: 0px 5px;
  }
  ::after {
    content: '';
    flex-grow: 1;
    background: rgba(0, 0, 0, 10);
    height: 1px;
    font-size: 0px;
    line-height: 0px;
    margin: 0px 5px;
  }
`;

const LoginReturnContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  display: flex;
  align-items: center;
  padding: 15px;
  transition: color 0.2s ease-in;

  &:hover {
    color: Red;
  }
`;

const LoginReturnDiv = styled.div`
  cursor: grab;
`;

export default AuthForgot;
