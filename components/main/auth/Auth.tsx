import { FormEvent, useState } from 'react';
import styled from 'styled-components';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { authService } from '@/firebase';
import AuthSocial from './AuthSocial';

interface AuthForm {
  email: string;
}
interface Props {
  closeModal: () => void;
  changeModalButton: () => void;
  forgotModalButton: () => void;
}

const Auth = (props: Props): JSX.Element => {
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const {
    register,
    formState: { errors },
  } = useForm<AuthForm>({ mode: 'onBlur' });

  const onClickLoginHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (error !== '') setError('');

    setAuthenticating(true);
    await signInWithEmailAndPassword(authService, email, password)
      .then(() => {
        props.closeModal();
      })
      .catch(() => {
        alert('로그인 실패, 다시 입력해주세요');
        setAuthenticating(false);
        setError('Failed Login');
      });
  };

  return (
    <div className="modalBody" onClick={(e) => e.stopPropagation()}>
      <LoginTextDiv>
        <h1>로그인</h1>
      </LoginTextDiv>
      <form>
        <LoginEmailPwContainer>
          <div>E-mail</div>
          <LoginEmailInput
            {...register('email', {
              required: '이메일을 올바르게 입력해주세요.',
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: '이메일을 올바르게 입력해주세요.',
              },
            })}
            name="email"
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="이메일을 입력해주세요"
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                onClickLoginHandler(e);
              }
            }}
          />
          <AuthWarn>{errors?.email?.message}</AuthWarn>
          <LoginPwTextDiv>
            <div>Password</div>
          </LoginPwTextDiv>
          <LoginPwInput
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호를 입력해주세요"
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                onClickLoginHandler(e);
              }
            }}
          />
        </LoginEmailPwContainer>
        <LoginBtnContainer>
          <LoginBtn
            type="submit"
            disabled={authenticating}
            onClick={(e) => onClickLoginHandler(e)}
          >
            <div>Login</div>
          </LoginBtn>
        </LoginBtnContainer>
      </form>

      <LoginOtherMethod>
        <LoginOrLine>
          <div>OR</div>
        </LoginOrLine>

        <LoginGoogleContainer>
          <AuthSocial closeModal={props.closeModal} />
        </LoginGoogleContainer>
      </LoginOtherMethod>

      <LoginCheckContainer onClick={props.changeModalButton}>
        <LoginCheckSignDiv>아직 회원이 아니신가요?</LoginCheckSignDiv>
      </LoginCheckContainer>

      <PwForgotContainer onClick={props.forgotModalButton}>
        <LoginCheckSignDiv>비밀번호를 잃어버리셨나요?</LoginCheckSignDiv>
      </PwForgotContainer>
    </div>
  );
};

const LoginContainer = styled.div`
  background-color: white;
  width: 500px;
  height: 460px;
  margin: 23vh auto;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
`;

const LoginTextDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const LoginEmailPwContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 150px;
  margin: 0 auto;
  margin-top: 30px;
`;

const LoginEmailInput = styled.input`
  height: 30px;
  margin-top: 10px;
  padding-left: 5px;
  background-color: white;
  border: 2px solid white;
  border-radius: 5px;
`;

const AuthWarn = styled.p`
  color: brandRed;
  font-size: 13px;
  font-weight: 700px;
`;

const LoginPwTextDiv = styled.div`
  margin-top: 10px;
`;

const LoginPwInput = styled.input`
  height: 30px;
  margin-top: 10px;
  padding-left: 5px;
  background-color: white;
  border: 2px solid white;
  border-radius: 5px;
`;

const LoginBtnContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 90px;
  background-color: white;
  border: none;
  border-radius: 15px;
  margin-top: 20px;
  transition: 0.1s;
  &:active {
    background-color: black;
  }
  &:hover {
    cursor: pointer;
    outline: solid 2px Red;
  }
`;

const LoginOtherMethod = styled.div``;

const LoginOrLine = styled.div`
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
    margin: 0px 8px;
  }
  ::after {
    content: '';
    flex-grow: 1;
    background: rgba(0, 0, 0, 10);
    height: 1px;
    font-size: 0px;
    line-height: 0px;
    margin: 0px 8px;
  }
`;

const LoginGoogleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 80px;
  margin-bottom: 30px;
`;

const LoginCheckContainer = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  display: flex;
  align-items: center;
  padding: 5px;
  transition: color 0.03s ease-in;

  &:hover {
    color: Red;
  }
`;

const PwForgotContainer = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;

  display: flex;
  align-items: center;
  padding: 10px;
  transition: color 0.2s ease-in;

  &:hover {
    color: Red;
  }
`;

const LoginCheckSignDiv = styled.div`
  cursor: grab;
`;

export default Auth;
