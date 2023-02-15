import { FormEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { authService } from '@/firebase';
import AuthSocial from './AuthSocial';
import { customAlert } from '@/utils/alerts';
// import Cookies from 'js-cookie';

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
  // const [isRemember, setIsRemember] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
  } = useForm<AuthForm>({ mode: 'onBlur' });

  const onClickLoginHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (error !== '') setError('');

    setAuthenticating(true);
    await signInWithEmailAndPassword(authService, email, password)
      .then((res) => {
        console.log(res);
        customAlert('로그인에 성공하였습니다!');
        // Cookies.set('userID', 'qkrdbwls', { expires: 10000 });
        props.closeModal();
      })
      .catch(() => {
        alert('로그인 실패, 다시 입력해주세요');
        setAuthenticating(false);
        setError('Failed Login');
      });
  };

  // useEffect(() => {
  //   //아이디 저장 체크할 경우 실행
  //           if(Cookies.save_id){
  //               setUserInfo(prev => {return {...prev, id : Cookies.get('save_id')}});
  //               setSaveId(true);
  //           }
  //   }

  //           if(saveId === true){ //아이디 저장 체크일 때
  //               setUserInfo(prev => {return {...prev, id: cookies.save_id}});

  //               if(cookies.save_id){ //이미 저장되어 있을 때
  //                   let cookie_id = Cookies.get('save_id')

  //                   if(userInfo.id !== cookie_id){ //쿠키에 저장된 아이디가 다를 때(30일)
  //                       Cookies.set('save_id', userInfo.id, {path: '/', expires: 30});
  //                   }
  //               }else{
  //                   Cookies.set('save_id', userInfo.id, {path:'/', expires: 30});
  //               }
  //           }else{
  //               if(cookies.save_id){
  //                   removeCookie('save_id');
  //               }
  //           }

  //       const handleOnChange = (e) => {
  //           setSaveId(e.target.checked);
  //       }

  return (
    <LoginContainer className="modalBody" onClick={(e) => e.stopPropagation()}>
      <LoginTextDiv>
        <h2>로그인하고, 제주사진 꿀팁 알아보세요!</h2>
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
        {/* <LoginRememberContainer>
          <LoginRememberCheck
            type="checkbox"
            id="checkbox"
            name="checkbox"
            checked={isRemember}
            onChange={handleOnChange}
          />
          <LoginRememberText htmlFor="checkbox">아이디 저장</LoginRememberText>
        </LoginRememberContainer> */}
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
      <LoginOtherModal>
        <PwForgotContainer onClick={props.forgotModalButton}>
          <LoginCheckSignDiv>비밀번호 찾기</LoginCheckSignDiv>
        </PwForgotContainer>
        <PwForgotBetweenLoginCheck>|</PwForgotBetweenLoginCheck>
        <LoginCheckContainer onClick={props.changeModalButton}>
          <LoginCheckSignDiv> 회원가입</LoginCheckSignDiv>
        </LoginCheckContainer>
      </LoginOtherModal>

      <LoginOtherMethod>
        <LoginSimpleLine>
          <div>간편로그인</div>
        </LoginSimpleLine>

        <LoginGoogleContainer>
          <AuthSocial closeModal={props.closeModal} />
        </LoginGoogleContainer>
      </LoginOtherMethod>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  border: 1px solid black;
  background-color: white;
  width: 500px;
  height: 460px;
  margin: 23vh auto;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  /* z-index: 999999999999999999; */
`;

const LoginTextDiv = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
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
// const LoginRememberContainer = styled.div`
//   height: 30px;
//   margin-top: 10px;
//   padding-left: 5px;
//   background-color: white;
//   border: 2px solid white;
//   border-radius: 5px;
// `;

// const LoginRememberText = styled.label`
//   display: flex;
// `;
// const LoginRememberCheck = styled.input`
//   display: flex;
//   justify-content: center;
// `;

const LoginBtnContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 400px;
  border: 1px solid black;
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
const LoginOtherModal = styled.div`
  padding: 5px;
  justify-content: center;
  display: flex;
`;
const PwForgotContainer = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  transition: color 0.2s ease-in;

  &:hover {
    color: Red;
  }
`;

const PwForgotBetweenLoginCheck = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

const LoginCheckContainer = styled.span`
  display: flex;
  justify-content: center;
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

const LoginOtherMethod = styled.div``;
const LoginSimpleLine = styled.div`
  display: flex;
  flex-basis: 100%;
  align-items: center;
  margin: 0px 0px;
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

const LoginGoogleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 80px;
  margin-bottom: 30px;
`;

export default Auth;
