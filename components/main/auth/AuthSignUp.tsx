import { useState } from 'react';
import styled from 'styled-components';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { authService } from '@/firebase';
import { customAlert } from '@/utils/alerts';
import { useMutation } from 'react-query';
import { addUser } from '@/api';

interface AuthForm {
  email: string;
  password: string;
  confirm: string;
  nickname: string;
}
interface Props {
  changeModalButton: () => void;
  closeLoginModal: () => void;
}

//* user 초기 데이터
let userState: any = {
  uid: '',
  userName: '',
  userImg: '/profileicon.svg',
};

const AuthSignUp = (props: Props) => {
  //* useMutation 사용해서 유저 추가하기
  const { mutate: onAddUser } = useMutation(addUser);
  const [registering, setRegistering] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [hidePassword, setHidePassword] = useState<boolean>(false);

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
        customAlert('회원가입을 축하합니다!');
        props.closeLoginModal();
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
  return (
    <SignUpContainer onClick={(e) => e.stopPropagation()}>
      <StHeder onClick={props.changeModalButton}> 〈 돌아가기 </StHeder>

      <SignUpTextDiv>회원가입하기</SignUpTextDiv>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SignUpEmailPwContainer>
          <EditInputBox>
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
          <AuthWarn>{errors?.confirm?.message}</AuthWarn>
          <EditInputBox>
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
  background-color: #ffffff;
  width: 400px;
  height: 75%;
  padding: 30px 30px 30px 30px;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.05);
`;

const StHeder = styled.header`
  cursor: pointer;
  color: #1882ff;
  font-size: 15px;
  display: flex;
`;

const SignUpTextDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  font-size: 20px;
  font-weight: 700;
  margin-top: 2vh;
`;

const SignUpEmailPwContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: 0 auto;
  margin-top: 40px;
`;

const SignUpInput = styled.input`
  height: 40px;
  width: 96%;
  padding-left: 10px;
  background-color: #fbfbfb;
  border: 1px solid #8e8e93;
  font-size: 15px;
`;
const EditInputBox = styled.div`
  width: 100%;
  position: relative;
`;
const EditclearBtn = styled.div`
  position: absolute;
  top: 25%;
  right: 12px;
  width: 24px;
  height: 24px;
  background-image: url(/cancle-button.png);
  background-repeat: no-repeat;

  cursor: pointer;
`;
const EditPwShowBtn = styled.div`
  position: absolute;
  top: 25%;
  right: 12px;
  width: 24px;
  height: 24px;
  background-image: url(/pw-show.png);
  background-repeat: no-repeat;

  cursor: pointer;
`;
const AuthWarn = styled.p`
  color: red;
  font-size: 10px;
  height: 10px;
  text-align: left;
`;

const SignUpBtnContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 90%;
  margin-top: 20px;
`;

const SignUpBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  border: transparent;
  transition: 0.1s;
  background-color: #1882ff;
  color: white;
  font-size: 15px;
  &:hover {
    cursor: pointer;
  }
`;
