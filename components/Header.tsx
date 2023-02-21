import { authService } from '@/firebase';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import ModalLogin from '@/components/ModalLogin';
import { useRouter } from 'next/router';

const Header = () => {
  const [currentUser, setCurrentUser] = useState(false);
  const [closeLoginModal, setCloseLoginModal] = useState(false);
  const [userImg, setUserImg] = useState<string | null>(null);
  const router = useRouter();
  const nowUser = authService.currentUser;
  // 로그인 모달 창 버튼
  const closeLoginModalButton = () => {
    setCloseLoginModal(!closeLoginModal);
  };

  useEffect(() => {
    if (authService.currentUser) {
      setCurrentUser(true);
      setUserImg(authService.currentUser.photoURL);
    }
  }, [nowUser]);
  return (
    <Nav>
      <Link href="/" style={{ color: 'black', textDecorationLine: 'none' }}>
        <Title
          onClick={() => {
            // sessionStorage.clear();
            localStorage.clear();
          }}
        >
          Picspot
        </Title>
      </Link>
      {/* 로그인, 로그아웃, 마이페이지 버튼 */}
      {closeLoginModal && <ModalLogin closeModal={closeLoginModalButton} />}
      {currentUser ? (
        <Profile onClick={() => router.push('/mypage')}>
          {userImg ? (
            <ProfileImg src={userImg} />
          ) : (
            <ProfileImg src="/profileicon.svg" />
          )}
        </Profile>
      ) : (
        <Profile onClick={closeLoginModalButton}>
          <ProfileImg src="/profileicon.svg" />
        </Profile>
      )}
    </Nav>
  );
};
export default Header;
const Nav = styled.div`
  /* position: fixed; */
  display: flex;
  justify-content: space-between;
  height: 70px;
  width: 80px;
`;
const Title = styled.h1`
  box-shadow: inset 0 -3px 0 0 red;
  box-shadow: none;
  font-size: 40px;
  font-weight: 900;
  margin-left: 30px;
  cursor: pointer;
`;
const Profile = styled.div`
  position: absolute;
  top: 15px;
  right: 20px;
  z-index: 999;
  width: 70px;
  height: 70px;
  border-radius: 50px;
  background-color: white;
  cursor: pointer;
`;
const ProfileImg = styled.img`
  margin-left: auto;
  width: 70px;
  height: 70px;
  border-radius: 50px;
  object-fit: cover;
  position: fixed;
  top: 10;
  left: 80;
  right: 20;
`;
