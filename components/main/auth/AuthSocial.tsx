import { useState } from 'react';
import styled from 'styled-components';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { authService } from '../../../firebase';
import { customAlert } from '@/utils/alerts';
import Image from 'next/image';
import { useMutation } from 'react-query';
import { addUser } from '@/api';

interface Props {
  closeModal: () => void;
}

const AuthSocial = (props: Props): JSX.Element => {
  //* useMutation 사용해서 유저 추가하기
  const { mutate: onAddUser } = useMutation(addUser);

  const [social, setSocial] = useState<boolean>(false);

  //* user 초기 데이터
  let userState: any = {
    uid: '',
    userName: '',
    userImg: '',
  };

  const signInWithGoogle = async () => {
    setSocial(true);

    signInWithPopup(authService, new GoogleAuthProvider())
      .then(() => {
        userState = {
          ...userState,
          uid: authService.currentUser?.uid,
          userName: authService.currentUser?.displayName,
          userImg: '/profileicon.svg',
        };
        props.closeModal();
        customAlert('로그인에 성공하였습니다!');
      })
      //* 구글 로그인 시 user 추가하기
      .then(() => {
        onAddUser(userState);
        localStorage.setItem('googleUser', 'true');
      })
      .catch(() => {
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
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 30px;
  padding: 5px;
  border: 1px solid #8e8e93;
  font-size: 15px;
`;

const StTextBox = styled.div`
  margin: auto;
`;

export default AuthSocial;
