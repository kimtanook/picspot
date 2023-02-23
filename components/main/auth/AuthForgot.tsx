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
        props.forgotModalButton();
      })
      .catch((error) => {
        alert('이메일 보내기에 실패하였습니다');
        setError(error.message);
        setSending(false);
      });
  };

  return (
    <ForgotPwContainer onClick={(e) => e.stopPropagation()}>
      <StHeder onClick={props.forgotModalButton}> 〈 돌아가기 </StHeder>

      {sent ? (
        <div>이미 당신의 이메일로 보냈습니다</div>
      ) : (
        <>
          <ForgotText>
            비밀번호를 찾기 위해 <br></br>
            사용자의 이메일을 입력해주세요
          </ForgotText>

          <ResetContainer>
            <ResetPwForm>
              <ResetPwInput
                type="email"
                name="email"
                id="email"
                placeholder="가입하신 이메일로 입력해주세요"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </ResetPwForm>

            <ResetPwBtn
              disabled={sending}
              onClick={() => resetPasswordRequest()}
            >
              메일 전송 〉
            </ResetPwBtn>
          </ResetContainer>

          <LoginReturnButton onClick={props.forgotModalButton}>
            로그인하러 가기
          </LoginReturnButton>
        </>
      )}
    </ForgotPwContainer>
  );
};

const ForgotPwContainer = styled.div`
  background-color: #ffffff;
  width: 400px;
  height: 50%;
  padding: 30px 30px 30px 30px;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.05);
`;

const StHeder = styled.header`
  cursor: pointer;
  color: #1882ff;
  font-size: 15px;
  display: flex;
`;

const ForgotText = styled.div`
  margin-top: 30px;
  font-size: 20px;
  font-weight: 700;
  margin-top: 5vh;
  text-align: center;
`;

const ResetContainer = styled.div`
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #8e8e93;
  margin: auto;
  margin-top: 40px;
  height: 40px;
`;

const ResetPwForm = styled.form``;

const ResetPwInput = styled.input`
  width: 200px;
  height: 30px;
  border: 1px solid white;
  margin-left: 10px;
  font-size: 10px;
`;

const ResetPwBtn = styled.button`
  width: 100px;
  height: 30px;
  font-weight: 600;
  border: 1px solid white;
  background-color: #1882ff;
  color: white;
  margin-right: 10px;
  font-size: 10px;
  cursor: pointer;
`;

const LoginReturnButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  border: transparent;
  transition: 0.1s;
  background-color: #8e8e93;
  color: white;
  font-size: 15px;
  cursor: pointer;
  margin: auto;
  margin-top: 40px;
  width: 80%;
`;

export default AuthForgot;
