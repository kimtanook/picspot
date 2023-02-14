import { useState } from 'react';
import styled from 'styled-components';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import AuthSocial from './AuthSocial';
import { useForm } from 'react-hook-form';
import { authService } from '@/firebase';
import { customAlert } from '@/utils/alerts';

interface AuthForm {
  email: string;
  password: string;
  confirm: string;
  nickname: string;
}
interface Props {
  changeModalButton: () => void;
  closeModal: () => void;
}

const AuthSignUp = (props: Props) => {
  const [registering, setRegistering] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthForm>({ mode: 'onBlur' });

  const onSubmit = async (data: AuthForm) => {
    if (data.password !== data.confirm) {
      alert('비밀번호가 일치하지 않습니다.');
      setError('비밀번호가 일치하지 않습니다');
      return;
    }
    if (error !== '') setError('');

    setRegistering(true);
    await createUserWithEmailAndPassword(authService, data.email, data.password)
      .then(() => {
        customAlert('회원가입을 축하합니다!');
        props.closeModal();
      })
      .catch((error) => {
        if (error.code.includes('auth/weak-password')) {
          setRegistering(false);
          alert('비밀번호는 6자 이상이어야 합니다.');
          return;
        }
        if (error.code.includes('auth/email-already-in-use')) {
          setRegistering(false);
          alert('이메일이 이미 존재합니다');
          return;
        }
        setRegistering(false);
        alert('등록할 수 없습니다. 다시 시도해주세요');
      });
  };
  console.log(nickname);
  return (
    <SignUpContainer onClick={(e) => e.stopPropagation()}>
      <SignUpTextDiv>
        <h1>회원가입</h1>
      </SignUpTextDiv>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SignUpEmailPwContainer>
          <div>E-mail</div>
          <SignUpEmailInput
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
                handleSubmit(onSubmit);
              }
            }}
            autoFocus
          />
          <AuthWarn>{errors?.email?.message}</AuthWarn>
          <SignUpPwTextDiv>
            <div>Password</div>
          </SignUpPwTextDiv>

          <SignUpPwInput
            {...register('password', {
              required: '비밀번호를 입력해주세요.',
              minLength: {
                value: 8,
                message:
                  '비밀번호는 숫자, 영문 대문자, 소문자, 특수문자를 포함한 8글자 이상이어야 합니다.',
              },
              pattern: {
                value:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                message:
                  '비밀번호는 숫자, 영문 대문자, 소문자, 특수문자를 포함한 8글자 이상이어야 합니다.',
              },
            })}
            name="password"
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호를 입력해주세요"
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(onSubmit);
              }
            }}
          />
          <AuthWarn>{errors?.password?.message}</AuthWarn>

          <SignUpPwConfirm>
            <div>Password Confirm</div>
          </SignUpPwConfirm>
          <SignUpPwConfirmInput
            {...register('confirm', {
              required: '비밀번호를 입력해주세요.',
              minLength: {
                value: 8,
                message:
                  '비밀번호는 숫자, 영문 대문자, 소문자, 특수문자를 포함한 8글자 이상이어야 합니다.',
              },
            })}
            autoComplete="new-password"
            name="confirm"
            type="password"
            id="confirm"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            placeholder="다시 입력해주세요"
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(onSubmit);
              }
            }}
          />
          <NicknameDiv>
            <div>Nickname</div>
          </NicknameDiv>
          <NicknameInput
            minLength={2}
            name="username"
            type="username"
            id="username"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="별명을 입력해주세요"
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(onSubmit);
              }
            }}
          />
          <AuthWarn>{errors?.confirm?.message}</AuthWarn>
        </SignUpEmailPwContainer>
      </form>
      <SignUpBtnContainer>
        <SignUpBtn
          onClick={handleSubmit(onSubmit)}
          type="submit"
          disabled={registering}
        >
          <div>SignUp</div>
        </SignUpBtn>
      </SignUpBtnContainer>
      <SignUpOtherMethod>
        <SignUpOrLine>
          <div>OR</div>
        </SignUpOrLine>
        <SignUpGoogleGitContainer>
          <AuthSocial closeModal={props.closeModal} />
        </SignUpGoogleGitContainer>
      </SignUpOtherMethod>
      <SignUpCheckContainer onClick={props.changeModalButton}>
        <SignUpCheckSign>이미 회원이신가요?</SignUpCheckSign>
      </SignUpCheckContainer>
    </SignUpContainer>
  );
};

export default AuthSignUp;

const SignUpContainer = styled.div`
  background-color: #e9ecef;
  background-color: white;
  width: 500px;
  height: 480px;
  margin: 23vh auto;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
`;
const SignUpTextDiv = styled.div`
  display: flex;
  justify-content: center;
`;
const SignUpEmailPwContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 250px;
  margin: 0 auto;
  /* margin-top: 20px; */
`;
const SignUpEmailInput = styled.input`
  height: 30px;
  margin-top: 7px;
  padding-left: 5px;
  background-color: white;
  border: 2px solid white;
  border-radius: 5px;
`;

const AuthWarn = styled.p`
  color: red;
  font-size: 13px;
  font-weight: 700px;
`;
// const SignUpPwContainer = styled.div``;

const SignUpPwTextDiv = styled.div`
  margin-top: 10px;
`;
const SignUpPwInput = styled.input`
  height: 30px;
  margin-top: 7px;
  padding-left: 5px;
  background-color: white;
  border: 2px solid white;
  border-radius: 5px;
`;
const SignUpPwConfirm = styled.div`
  margin-top: 10px;
`;
const SignUpPwConfirmInput = styled.input`
  height: 30px;
  margin-top: 7px;
  padding-left: 5px;
  background-color: white;
  border: 2px solid white;
  border-radius: 5px;
`;
const NicknameDiv = styled.div`
  margin-top: 10px;
`;
const NicknameInput = styled.input`
  height: 30px;
  margin-top: 7px;
  padding-left: 5px;
  background-color: white;
  border: 2px solid white;
  border-radius: 5px;
`;
const SignUpBtnContainer = styled.div`
  border: 1px solid black;
  display: flex;
  margin-top: 100px;
  justify-content: center;
  align-items: center;
`;
const SignUpBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 90px;
  background-color: white;
  border: 2px solid white;
  border-radius: 15px;
  transition: 0.03s;
  /* &:active {
    background-color: black;
  } */
  &:hover {
    cursor: pointer;
    outline: solid 2px red;
  }
`;
const SignUpOtherMethod = styled.div``;
const SignUpOrLine = styled.div`
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
const SignUpGoogleGitContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 80px;
`;

const SignUpCheckContainer = styled.div`
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
const SignUpCheckSign = styled.div`
  cursor: grab;
`;
