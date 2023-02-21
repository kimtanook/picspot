import { authService } from '@/firebase';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import ModalLogin from '@/components/ModalLogin';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { customAlert } from '@/utils/alerts';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const [closeLoginModal, setCloseLoginModal] = useState(false);
  const router = useRouter();
  const nowUser = authService.currentUser;
  // 로그인 모달 창 버튼
  const closeLoginModalButton = () => {
    setCloseLoginModal(!closeLoginModal);
  };

  // 로그아웃
  const logOut = () => {
    signOut(authService).then(() => {
      // Sign-out successful.
      localStorage.clear();
      setCurrentUser(false);
      customAlert('로그아웃에 성공하였습니다!');
    });
  };
  useEffect(() => {
    if (authService.currentUser) {
      setCurrentUser(true);
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
      <Profile onClick={() => setIsProfileOpen(!isProfileOpen)}>
        {authService.currentUser?.photoURL ? (
          <ProfileImg src={authService.currentUser?.photoURL} />
        ) : (
          <ProfileImg src="/profileicon.svg" />
        )}
      </Profile>
      {isProfileOpen === true ? (
        <Menu>
          {currentUser ? (
            <MenuItem onClick={() => router.push('/mypage')}>
              {' '}
              마이페이지
            </MenuItem>
          ) : (
            <MenuItem hidden onClick={() => router.push('/mypage')} />
          )}
          {currentUser ? (
            <MenuItem onClick={logOut}>로그아웃</MenuItem>
          ) : (
            <MenuItem onClick={closeLoginModalButton}>로그인</MenuItem>
          )}
        </Menu>
      ) : null}
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
const Menu = styled.div`
  width: 100px;
  height: 85px;
  position: absolute;
  top: 95px;
  right: 20px;
  background-color: orange;
  border-radius: 5px;
  box-shadow: 1px 1px 1px orange;
  text-align: center;
  color: white;
  font-family: GmarketSans;
  z-index: 6000;
`;
const MenuItem = styled.p`
  cursor: pointer;
`;
