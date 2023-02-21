import { useState } from 'react';
import styled from 'styled-components';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { authService } from '../../../firebase';
import { customAlert } from '@/utils/alerts';
import Image from 'next/image';

interface Props {
  closeModal: () => void;
}

const AuthSocial = (props: Props): JSX.Element => {
  const [social, setSocial] = useState<boolean>(false);

  const signInWithGoogle = async () => {
    setSocial(true);

    signInWithPopup(authService, new GoogleAuthProvider())
      .then((response) => {
        props.closeModal();
        customAlert('로그인에 성공하였습니다!');
      })
      .catch((error) => {
        setSocial(false);
      });
  };

  return (
    <>
      <GoogleBtn
        type="button"
        name="google"
        onClick={() => signInWithGoogle()}
        disabled={social}
      >
        <Image
          src="/google.svg"
          alt="image"
          width={30}
          height={30}
          style={{ position: 'absolute' }}
        />

        <StTextBox>구글 이메일로 로그인하기</StTextBox>
      </GoogleBtn>
    </>
  );
};

const GoogleBtn = styled.button`
  background-color: #f4f4f4;
  &:hover {
    cursor: pointer;
  }

  width: 100%;
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 30px;
  padding: 5px;
  border: 1px solid #8e8e93;
`;

const StTextBox = styled.div`
  margin: auto;
`;

export default AuthSocial;
