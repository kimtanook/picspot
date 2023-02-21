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
      <ProfileMenu>
        <div onClick={() => setIsProfileOpen(!isProfileOpen)}>
          {authService.currentUser?.photoURL ? (
            <ProfileImg src={authService.currentUser?.photoURL} />
          ) : (
            <ProfileImg src="/profileicon.svg" />
          )}
        </div>
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
      </ProfileMenu>
    </HeaderContainer>
  );
};
export default Header;

const HeaderContainer = styled.div`
  width: 1440px;
  position: fixed;
  display: flex;
  justify-content: space-between;
  height: 70px;
  z-index: 10;
`;
const Title = styled.div`
  font-weight: 900;
  font-size: 24px;
  cursor: pointer;
`;
const ProfileMenu = styled.div``;
const Menu = styled.div`
  width: 100px;
  height: 85px;
  position: absolute;
  right: 10px;
  background-color: orange;
  border-radius: 5px;
  text-align: center;
  color: white;
  z-index: 6000;
`;
const MenuItem = styled.p`
  cursor: pointer;
  :hover {
    color: black;
  }
`;
const ProfileImg = styled.img`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
`;
