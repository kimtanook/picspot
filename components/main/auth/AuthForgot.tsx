import { sendPasswordResetEmail, getAuth } from 'firebase/auth';
import { useState } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { forgotModalAtom, loginModalAtom } from '@/atom';

const AuthForgot = (): JSX.Element => {
  const [sending, setSending] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const authService = getAuth();
  const [forgotModal, setForgotModal] = useRecoilState(forgotModalAtom);
  const [closeLoginModal, setCloseLoginModal] = useRecoilState(loginModalAtom);
  const resetPasswordRequest = async () => {
    if (error !== '') setError('');

    setSending(true);
    await sendPasswordResetEmail(authService, email)
      .then(() => {
        alert('이메일에 링크를 보냈습니다');
        setSent(true);
        setSending(false);
        setCloseLoginModal(false);
        setForgotModal(false);
      })
      .catch((error) => {
        alert('이메일 보내기에 실패하였습니다');
        setError(error.message);
        setSending(false);
      });
  };

  return (
    <ForgotPwContainer onClick={(e) => e.stopPropagation()}>
      <Heder
        onClick={() => {
          setCloseLoginModal(!closeLoginModal);
          setForgotModal(!forgotModal);
        }}
      >
        {' '}
        〈 돌아가기{' '}
      </Heder>

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
              메일 전송 {'〉'}
            </ResetPwBtn>
          </ResetContainer>

          <LoginReturnButton
            onClick={() => {
              setCloseLoginModal(!closeLoginModal);
              setForgotModal(!forgotModal);
            }}
          >
            로그인하러 가기
          </LoginReturnButton>
        </>
      )}
    </ForgotPwContainer>
  );
};

const ForgotPwContainer = styled.div`
  width: 100%;
  height: 100%;
  /* margin-bottom: 50px; */
`;

const Heder = styled.header`
  cursor: pointer;
  color: #1882ff;
  font-size: 15px;
  display: flex;
  margin-bottom: 50px;
  margin-left: 20px;
`;

const ForgotText = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
`;

const ResetContainer = styled.div`
  width: 394px;
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #8e8e93;
  margin: auto;
  margin-top: 40px;
`;

const ResetPwForm = styled.form``;

const ResetPwInput = styled.input`
  width: 200px;
  height: 30px;
  border: 1px solid white;
  margin-left: 10px;
  font-family: 'Noto Sans CJK KR';
  font-style: normal;
  font-size: 13px;
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
  border: transparent;
  transition: 0.1s;
  background-color: #8e8e93;
  color: white;
  font-size: 15px;
  cursor: pointer;
  margin: auto;
  margin-top: 90px;
  margin-bottom: 50px;
  width: 394px;
  height: 48px;
`;

export default AuthForgot;
