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
    <HeaderContainer>
      {/* 로그인, 로그아웃, 마이페이지 버튼 */}
      {closeLoginModal && <ModalLogin closeModal={closeLoginModalButton} />}
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
        <div onClick={() => router.push('/mypage')}>
          {userImg ? (
            <ProfileImg src={userImg} />
          ) : (
            <ProfileImg src="/profileicon.svg" />
          )}
        </div>
      ) : (
        <div onClick={closeLoginModalButton}>
          <ProfileImg src="/profileicon.svg" />
        </div>
      )}
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.div`
  position: fixed;
  /* width: 1440px; */
  margin: auto;
  display: flex;
  justify-content: space-between;
  height: 70px;
  z-index: 3;
`;
const Title = styled.div`
  font-weight: 900;
  font-size: 24px;
  cursor: pointer;
`;
const ProfileImg = styled.img`
  position: fixed;
  left: 86%;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  @media only screen and (max-width: 1440px) {
    left: 95%;
  }
`;
