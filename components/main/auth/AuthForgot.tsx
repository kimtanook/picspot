import { sendPasswordResetEmail, getAuth } from 'firebase/auth';
import { useState } from 'react';
import styled from 'styled-components';

const AuthForgot = (): JSX.Element => {
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
    <ForgotPwContainer>
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

export default AuthForgot;
