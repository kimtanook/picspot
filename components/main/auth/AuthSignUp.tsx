import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { authService } from '@/firebase';
import { customConfirm } from '@/utils/alerts';
import { useMutation } from 'react-query';
import { addUser } from '@/api';
import { useRecoilState } from 'recoil';
import {
  AuthCurrentUser,
  forgotModalAtom,
  loginModalAtom,
  signUpModalAtom,
} from '@/atom';
import { setAmplitudeUserId } from '@/utils/amplitude';
import { useMediaQuery } from 'react-responsive';

interface AuthForm {
  email: string;
  password: string;
  confirm: string;
  nickname: string;
}

//* user 초기 데이터
let userState: any = {
  uid: '',
  userName: '',
  userImg: '/profileicon.svg',
};

const AuthSignUp = () => {
  //* useMutation 사용해서 유저 추가하기
  const { mutate: onAddUser } = useMutation(addUser);
  const [registering, setRegistering] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useRecoilState(AuthCurrentUser);
  const [nickname, setNickname] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [hidePassword, setHidePassword] = useState<boolean>(false);
  const [signUpModal, setSignUpModal] = useRecoilState(signUpModalAtom);
  const [forgotModal, setForgotModal] = useRecoilState(forgotModalAtom);
  const [closeLoginModal, setCloseLoginModal] = useRecoilState(loginModalAtom);
  const isMobile = useMediaQuery({ maxWidth: 785 });
  const isPc = useMediaQuery({ minWidth: 784 });
  const {
    register,
    setValue,
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
        updateProfile(authService?.currentUser!, {
          displayName: nickname,
          photoURL: '/profileicon.svg',
        });
        userState = {
          ...userState,
          uid: authService.currentUser?.uid,
          userName: nickname,
        };
        customConfirm('회원가입을 축하합니다!');
        setCloseLoginModal(false);
        setSignUpModal(false);
        setForgotModal(false);
        setAmplitudeUserId(authService.currentUser?.uid);
        setCurrentUser(true);
      })
      .then(() => {
        //* 회원가입 시 user 추가하기
        onAddUser(userState);
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
        if (error.code.includes('auth/invalid-display-name-in-use')) {
          setRegistering(false);
          alert('닉네임이 이미 존재합니다');
          return;
        }
        setRegistering(false);
        alert('등록할 수 없습니다. 다시 시도해주세요');
      });
  };
  const toggleHidePassword = () => {
    setHidePassword(!hidePassword);
  };
  // 모달 창 뒤에 누르면 닫힘
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
  }, [closeLoginModal || signUpModal]);
  return (
    <SignUpContainer onClick={(e) => e.stopPropagation()}>
      <Heder
        onClick={() => {
          setCloseLoginModal(!closeLoginModal);
          setSignUpModal(!signUpModal);
        }}
      >
        {isMobile && <MobileCancle src="/Back-point.png" alt="image" />}
        {isPc && '〈 돌아가기 '}{' '}
      </Heder>

      <SignUpTextDiv>
        {isMobile && <b>회원가입</b>}
        {isPc && <b>회원가입하기</b>}
      </SignUpTextDiv>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SignUpEmailPwContainer>
          <EditInputBox>
            {isMobile && <EditInputText> 이메일 설정</EditInputText>}
            <SignUpInput
              {...register('email', {
                required: '*올바른 이메일 형식을 입력해주세요',
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: '*올바른 이메일 형식을 입력해주세요',
                },
              })}
              placeholder="이메일을 입력해주세요"
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(onSubmit);
                }
              }}
              autoFocus
            />
            <EditclearBtn
              onClick={() => {
                setValue('email', '');
              }}
            ></EditclearBtn>
          </EditInputBox>
          <AuthWarn>{errors?.email?.message}</AuthWarn>
          <EditInputBox>
            {isMobile && <EditInputText> 비밀번호 설정</EditInputText>}
            <SignUpInput
              {...register('password', {
                required: '비밀번호를 입력해주세요.',
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
              placeholder="비밀번호를 입력해주세요"
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(onSubmit);
                }
              }}
            />
            <EditPwShowBtn onClick={toggleHidePassword}></EditPwShowBtn>
          </EditInputBox>
          <AuthWarn>{errors?.password?.message}</AuthWarn>
          <EditInputBox>
            <SignUpInput
              {...register('confirm', {
                required: '비밀번호를 입력해주세요.',
                minLength: {
                  value: 8,
                  message: '입력하신 비밀번호와 일치하지 않아요',
                },
              })}
              type={hidePassword ? 'text' : 'password'}
              placeholder="비밀번호를 다시한번 입력해 주세요"
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(onSubmit);
                }
              }}
            />
            <EditPwShowBtn onClick={toggleHidePassword}></EditPwShowBtn>
          </EditInputBox>

          <AuthConfirm>{errors?.confirm?.message}</AuthConfirm>
          <EditInputBox>
            {isMobile && <EditInputText> 닉네임 설정</EditInputText>}
            <SignUpInput
              {...register('nickname', {
                required: '닉네임를 입력해주세요.',
                minLength: {
                  value: 2,
                  message: '2글자이상 입력해주세요.',
                },
              })}
              placeholder="닉네임을 입력해 주세요"
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(onSubmit);
                }
              }}
              onChange={(event) => setNickname(event.target.value)}
            />
            <EditclearBtn
              onClick={() => {
                setValue('nickname', '');
              }}
            ></EditclearBtn>
          </EditInputBox>
          <AuthWarn>{errors?.nickname?.message}</AuthWarn>
        </SignUpEmailPwContainer>
      </form>

      <SignUpBtnContainer>
        <SignUpBtn
          onClick={handleSubmit(onSubmit)}
          type="submit"
          disabled={registering}
        >
          <div>회원가입 완료</div>
        </SignUpBtn>
      </SignUpBtnContainer>
    </SignUpContainer>
  );
};

export default AuthSignUp;

const SignUpContainer = styled.div`
  margin-bottom: 100px;
`;

const Heder = styled.div`
  cursor: pointer;
  color: #1882ff;
  font-size: 15px;
  display: flex;
  margin-bottom: 50px;
  margin-left: -50px;
  @media ${(props) => props.theme.mobile} {
    transform: translate(55%, 150%);
    width: 30%;
  }
`;

const MobileCancle = styled.img``;
const SignUpTextDiv = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 60px;
  @media ${(props) => props.theme.mobile} {
    transform: translate(55%, -170%);
    width: 50%;
    font-weight: bold;
    font-size: 14px;
  }
`;

const SignUpEmailPwContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin-top: 40px;
`;

const SignUpInput = styled.input`
  padding-left: 16px;
  background-color: #f4f4f4;
  border: 1px solid #8e8e93;
  font-size: 15px;
  display: flex;
  width: 100%;
  height: 48px;
  font-size: 14px;
  @media ${(props) => props.theme.mobile} {
    /* transform: translate(-5%, 0%); */
    font-size: 12px;
    width: 326px;
    height: 48px;
    border: none;
    border-bottom: 2px solid #1882ff;
    background: #fbfbfb;
  }
`;
const EditInputBox = styled.div`
  position: relative;
  width: 394px;
  height: 48px;
  @media ${(props) => props.theme.mobile} {
    width: 90%;
    height: 60px;
    background: transparent;
  }
`;
const EditInputText = styled.div`
  font-size: 12px;
  font-weight: bold;
  width: 80%;
  height: 20px;
  position: inherit;
  @media ${(props) => props.theme.mobile} {
    transform: translate(-0%, 0%);
    position: inherit;
  }
`;

const EditclearBtn = styled.div`
  position: absolute;
  top: 35%;
  left: 360px;
  width: 24px;
  height: 24px;
  background-image: url(/cancle-button.png);
  background-repeat: no-repeat;
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    transform: translate(-270%, -210%);
    position: inherit;
  }
`;
const EditPwShowBtn = styled.div`
  position: absolute;
  top: 35%;
  left: 360px;
  width: 24px;
  height: 24px;
  background-image: url(/pw-show.png);
  background-repeat: no-repeat;
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    transform: translate(-270%, -220%);
    position: inherit;
  }
`;
const AuthWarn = styled.p`
  color: red;
  font-size: 10px;
  height: 10px;
  @media ${(props) => props.theme.mobile} {
    transform: translate(0%, -10%);
    font-size: 12px;
    border: none;
    background: transparent;
  }
`;
const AuthConfirm = styled.p`
  color: red;
  font-size: 10px;
  height: 10px;
  @media ${(props) => props.theme.mobile} {
    transform: translate(0%, -170%);
    font-size: 12px;
    border: none;
    background: transparent;
  }
`;

const SignUpBtnContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin-top: 20px;
`;

const SignUpBtn = styled.button`
  border: 1px solid;
  display: flex;
  width: 394px;
  height: 48px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 0px;
  transition: 0.1s;
  background-color: #1882ff;
  color: white;
  font-size: 15px;
  &:hover {
    cursor: pointer;
  }
  @media ${(props) => props.theme.mobile} {
    font-size: 14px;
    width: 326px;
    height: 48px;
    position: inherit;
  }
`;
