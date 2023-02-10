import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Auth from './main/auth/Auth';
import AuthSignUp from './main/auth/AuthSignUp';
import AuthForgot from './main/auth/AuthForgot';
interface Props {
  closeModal: () => void;
}

function ModalLogin(props: Props) {
  function closeModal() {
    props.closeModal();
  }
  // 모달창이 나왔을때 백그라운드 클릭이 안되게 하고 스크롤도 고정하는 방법
  useEffect(() => {
    document.body.style.cssText = `
    position: fixed; 
    top: -${window.scrollY}px;
    overflow-y: scroll;
    width: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = '';
      window.scrollTo(0, parseInt(scrollY) * -1);
    };
  }, []);

  const [signUpModal, setSignUpModal] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);
  // 회원가입 모달 창
  const changeModalButton = () => {
    setSignUpModal(!signUpModal);
  };
  // 비밀번호 찾기 모달 창
  const forgotModalButton = () => {
    setForgotModal(!forgotModal);
  };
  return (
    <ModalStyled>
      {forgotModal ? (
        <AuthForgot />
      ) : signUpModal ? (
        <AuthSignUp changeModalButton={changeModalButton} />
      ) : (
        <Auth
          closeModal={closeModal}
          forgotModalButton={forgotModalButton}
          changeModalButton={changeModalButton}
        />
      )}
      <ForgotOtherMethod>
        <ForgotOrLine>
          <div>OR</div>
        </ForgotOrLine>
        <SignUpCheckContainer onClick={props.closeModalButton}>
          <SignUpCheckSign>이미 회원이신가요?</SignUpCheckSign>
        </SignUpCheckContainer>
      </ForgotOtherMethod>
    </ModalStyled>
  );
}

export default ModalLogin;

const ModalStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  z-index: 10;
  justify-content: center;
  align-items: center;
  .modalBody {
    position: absolute;
    color: black;
    width: 300px;
    height: 300px;
    padding: 30px 30px 30px 30px;
    z-index: 13;
    text-align: left;
    background-color: rgb(255, 255, 255);
    border-radius: 20px;
    box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
  }
  #modalCloseBtn {
    position: absolute;
    top: 215px;
    z-index: 11;
    right: 28px;
    border: 1px solid rgb(220, 220, 220);
    width: 80%;
    height: 15%;
    border-radius: 12%/60%;
    color: rgba(0, 0, 0, 0.7);
    background-color: transparent;
    font-size: 3vmin;
    font-weight: 600;
    transition: 0.3s;
    &:hover {
      background-color: rgb(230, 230, 230);
      cursor: pointer;
    }
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

const SignUpCheckContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  a {
    display: flex;
    align-items: center;
    padding: 15px;
    transition: color 0.2s ease-in;
  }
  &:hover {
    a {
      color: Red;
    }
  }
`;
