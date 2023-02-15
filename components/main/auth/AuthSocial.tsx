import { useState } from 'react';
import styled from 'styled-components';
import { FaGoogle } from 'react-icons/fa';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { authService } from '../../../firebase';
import { customAlert } from '@/utils/alerts';

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
        <FaGoogle size="48px" />
      </GoogleBtn>
    </>
  );
};
const GoogleBtn = styled.button`
  background-color: white;

  border-radius: 10px;
  border: 1px solid white60;
  &:active {
    background-color: white;
  }
  &:hover {
    cursor: pointer;
  }
`;

export default AuthSocial;
