import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { authService } from '@/firebase';
import AuthSocial from './AuthSocial';
import { customConfirm } from '@/utils/alerts';
import { useRecoilState } from 'recoil';
import {
  signUpModalAtom,
  forgotModalAtom,
  loginModalAtom,
  AuthCurrentUser,
} from '@/atom';
import { useMediaQuery } from 'react-responsive';
import { setAmplitudeUserId } from '@/utils/amplitude';

interface AuthForm {
  email: string;
  password: string;
}

const Auth = (): JSX.Element => {
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [hidePassword, setHidePassword] = useState<boolean>(false);
  const [isRemember, setIsRemember] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useRecoilState(AuthCurrentUser);
  const LS_KEY_ID = 'LS_KEY_ID';
  const [signUpModal, setSignUpModal] = useRecoilState(signUpModalAtom);
  const [forgotModal, setForgotModal] = useRecoilState(forgotModalAtom);
  const [closeLoginModal, setCloseLoginModal] = useRecoilState(loginModalAtom);
  const isMobile = useMediaQuery({ maxWidth: 785 });
  const isPc = useMediaQuery({ minWidth: 784 });
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AuthForm>({ mode: 'onBlur' });

  const onSubmit = async (data: AuthForm) => {
    setAuthenticating(true);
    if (isRemember) {
      localStorage.setItem(LS_KEY_ID, data.email);
      localStorage.setItem('isRemember', 'ture');
    } else if (!isRemember) {
      localStorage.removeItem(LS_KEY_ID);
      localStorage.removeItem('isRemember');
    }
    await signInWithEmailAndPassword(authService, data.email, data.password)
      .then((res) => {
        customConfirm('로그인에 성공하였습니다!');
        setCloseLoginModal(!closeLoginModal);
        setAmplitudeUserId(authService.currentUser?.uid);
        setCurrentUser(true);
      })
      .then(() => {})
      .catch(() => {
        setError('password', {
          type: 'invalid',
          message: '비밀번호를 잘못 입력하셨어요',
        });
        setAuthenticating(false);
      });
  };

  const toggleHidePassword = () => {
    setHidePassword(!hidePassword);
  };
  const handleSaveIDFlag = () => {
    if (!isRemember) {
      localStorage.setItem('isRemember', 'ture');
    } else {
      localStorage.removeItem('isRemember');
      localStorage.removeItem(LS_KEY_ID);
    }
    setIsRemember(!isRemember);
  };

  // 아이디 저장
  useEffect(() => {
    let idFlag = localStorage.getItem(LS_KEY_ID);

    let isRememberStorage = localStorage.getItem('isRemember');
    if (isRememberStorage) {
      setIsRemember(true);
    }
    if (idFlag !== null && isRememberStorage) {
      setValue('email', idFlag);
    }
  }, [isRemember]);

  useEffect(() => {
    const html = document.documentElement;
    if (closeLoginModal || signUpModal) {
      html.style.overflowY = 'hidden';
      html.style.overflowX = 'hidden';
    } else {
      html.style.overflowY = 'auto';
      html.style.overflowX = 'auto';
    }
    return () => {
      html.style.overflowY = 'auto';
      html.style.overflowX = 'auto';
    };
  }, [closeLoginModal, signUpModal]);

  return (
    <LoginContainer className="modalBody" onClick={(e) => e.stopPropagation()}>
      <Header>
        <div
          onClick={() => {
            setCloseLoginModal(!closeLoginModal);
          }}
        >
          {isMobile && <MobileCancle src="/Back-point.png" alt="image" />}
          {isPc && <div style={{ cursor: 'pointer' }}>〈 취소</div>}
        </div>
      </Header>
      <LogoImg src="/logo.png" alt="image" />
      <LoginTextDiv>
        {isMobile ? <p>픽스팟에 로그인하고, 제주 인생샷 알아보세요!</p> : ''}
        {isPc ? (
          <p>
            <b>픽스팟에 로그인</b> 하고, <br></br>
            제주 인생샷 알아보세요!
          </p>
        ) : (
          ''
        )}
      </LoginTextDiv>

      <form onSubmit={handleSubmit(onSubmit)}>
        <LoginEmailPwContainer>
          <EditInputBox>
            <LoginInput
              {...register('email', {
                required: '*등록되지 않은 아이디예요',
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: '*등록되지 않은 아이디예요',
                },
              })}
              placeholder="이메일을 입력 해주세요"
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(onSubmit);
                }
              }}
            />
            <EditclearBtn
              onClick={() => {
                setValue('email', '');
              }}
            ></EditclearBtn>
          </EditInputBox>
          <AuthWarn>{errors?.email?.message}</AuthWarn>
          <EditInputBox>
            <LoginInput
              {...register('password', {
                required: '*비밀번호를 입력해주세요',
                minLength: {
                  value: 8,
                  message:
                    '*7~20자리 숫자 내 영문 숫자 혼합 비밀번호를 입력해주세요',
                },
                pattern: {
                  value:
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                  message:
                    '*7~20자리 숫자 내 영문 숫자 혼합 비밀번호를 입력해주세요',
                },
              })}
              type={hidePassword ? 'text' : 'password'}
              placeholder="비밀번호를 입력 해주세요"
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(onSubmit);
                }
              }}
            />
            <EditPwShowBtn onClick={toggleHidePassword}></EditPwShowBtn>
          </EditInputBox>
          <AuthWarn>{errors?.password?.message}</AuthWarn>
        </LoginEmailPwContainer>
        <RememberID>
          <input
            type="checkbox"
            name="saveEmail"
            id="saveEmail"
            checked={isRemember}
            onChange={handleSaveIDFlag}
          />
          {isMobile ? <div>로그인 정보 저장</div> : ''}
          {isPc ? <div>아이디 저장</div> : ''}
        </RememberID>
        <LoginBtnContainer>
          <LoginBtn type="submit" disabled={authenticating}>
            {isMobile ? <div>로그인</div> : ''}
            {isPc ? <div>로그인 하기</div> : ''}
          </LoginBtn>
        </LoginBtnContainer>
      </form>

      <PwForgotContainer
        onClick={() => {
          setCloseLoginModal(!closeLoginModal);
          setForgotModal(!forgotModal);
        }}
      >
        {isMobile ? (
          <LoginCheckSignDiv>아이디/비밀번호 찾기</LoginCheckSignDiv>
        ) : (
          ''
        )}
        {isPc ? (
          <LoginCheckSignDiv>아이디/패스워드를 잊으셨나요?</LoginCheckSignDiv>
        ) : (
          ''
        )}
      </PwForgotContainer>

      <LoginGoogleContainer>
        <AuthSocial
          closeModal={() => {
            setCloseLoginModal(!closeLoginModal);
          }}
        />
      </LoginGoogleContainer>

      <LoginCheckContainer
        onClick={() => {
          setCloseLoginModal(!closeLoginModal);
          setSignUpModal(!signUpModal);
        }}
      >
        <LoginCheckSignDiv>회원가입 하기</LoginCheckSignDiv>
      </LoginCheckContainer>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  width: 100%;
  height: 100%;
  margin-bottom: 50px;
  @media ${(props) => props.theme.mobile} {
    background-color: #f7f7f7;
    width: 400px;
    height: 700px;
  }
`;
const Header = styled.div`
  z-index: 1000000;
  color: #1882ff;
  font-size: 15px;
  display: flex;
  margin-bottom: 40px;
  margin-left: -30px;
  @media ${(props) => props.theme.mobile} {
    transform: translate(55%, 200%);
    width: 30%;
  }
`;

const MobileCancle = styled.img``;

const LogoImg = styled.img`
  display: none;
  @media ${(props) => props.theme.mobile} {
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translate(-50%, 2000%);
    display: inherit;
    width: 130px;
    height: 40px;
  }
`;
const LoginTextDiv = styled.div`
  margin-top: 0px;
  margin-bottom: 10px;
  font-family: 'Noto Sans CJK KR';
  font-style: normal;
  font-size: 20px;
  line-height: 138.5%;
  text-align: center;
  color: #212121;
  @media ${(props) => props.theme.mobile} {
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translate(-50%, 2600%);
    display: inherit;
    width: 254px;
    height: 21px;
    font-size: 12px;
  }
`;
const LoginEmailPwContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: 0 auto;
  margin-top: 40px;
  @media ${(props) => props.theme.mobile} {
    gap: 8px;
    z-index: 10;
  }
`;
const LoginInput = styled.input`
  padding-left: 16px;
  background-color: #f4f4f4;
  border: 1px solid #8e8e93;
  font-size: 15px;
  display: flex;
  width: 394px;
  height: 48px;
  margin-left: -20px;
  @media ${(props) => props.theme.mobile} {
    transform: translate(11%, -90%);
    font-size: 12px;
    width: 326px;
    height: 48px;
    top: 250.31px;
    /* border: none; */
    border-bottom: 2px solid #1882ff;
    background: #fbfbfb;
    position: absolute;
  }
`;
const AuthWarn = styled.p`
  color: red;
  font-size: 10px;
  height: 10px;
  margin-left: -20px;
  @media ${(props) => props.theme.mobile} {
    transform: translate(10%, 2200%);
    font-size: 10px;
    border: none;
    background: transparent;
  }
`;
const EditInputBox = styled.div`
  position: relative;
  width: 10px;
  @media ${(props) => props.theme.mobile} {
    transform: translate(0%, 0%);
  }
`;
const EditclearBtn = styled.div`
  position: absolute;
  top: 35%;
  left: 340px;
  width: 24px;
  height: 24px;
  background-image: url(/cancle-button.png);
  background-repeat: no-repeat;
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    transform: translate(-110%, 920%);
    position: inherit;
  }
`;
const EditPwShowBtn = styled.div`
  position: absolute;
  top: 35%;
  left: 340px;
  width: 24px;
  height: 24px;
  background-image: url(/pw-show.png);
  background-repeat: no-repeat;
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    transform: translate(-110%, 930%);
    position: inherit;
  }
`;

const RememberID = styled.label`
  display: flex;
  align-items: center;
  font-size: 15px;
  font-family: Noto Sans CJK KR;
  @media ${(props) => props.theme.mobile} {
    transform: translate(9%, 1150%);
    font-size: 12px;
  }
`;
const LoginBtnContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 90%;
  margin-top: 20px;
`;
const LoginBtn = styled.button`
  display: flex;
  width: 394px;
  height: 48px;
  margin-left: -20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: transparent;
  transition: 0.1s;
  background-color: #1882ff;
  color: white;
  font-size: 15px;
  &:hover {
    cursor: pointer;
  }
  @media ${(props) => props.theme.mobile} {
    transform: translate(11%, 30%);
    font-size: 14px;
    width: 326px;
    height: 48px;
    margin-top: 200px;
    position: inherit;
  }
`;
const PwForgotContainer = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  transition: color 0.2s ease-in;
  margin-top: 10px;
  color: #1882ff;
  @media ${(props) => props.theme.mobile} {
    font-size: 14px;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    align-items: center;
    transform: translate(-5%, 210%);
    width: 300px;
  }
`;
const LoginGoogleContainer = styled.div`
  display: flex;
  width: 394px;
  height: 48px;
  margin: 0 auto;
  margin-top: 30px;
  @media ${(props) => props.theme.mobile} {
    font-size: 14px;
    width: 326px;
    height: 48px;
    transform: translate(0%, -100%);
    position: inherit;
  }
`;
const LoginCheckContainer = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  transition: color 0.2s ease-in;
  margin-top: 20px;
  color: #1882ff;
  @media ${(props) => props.theme.mobile} {
    font-size: 14px;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    align-items: center;
    transform: translate(130%, -145%);
    width: 150px;
  }
`;
const LoginCheckSignDiv = styled.div`
  cursor: pointer;
  text-decoration: underline;
  font-size: 15px;
`;

export default Auth;
