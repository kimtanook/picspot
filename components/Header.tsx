import { authService } from '@/firebase';
import Link from 'next/link';
import { ChangeEventHandler, useEffect, useState } from 'react';
import styled from 'styled-components';

import ModalLogin from '@/components/ModalLogin';
import { useRouter } from 'next/router';

const Header = ({
  selectCity,
  onChangeSelectCity,
}: {
  selectCity: string;
  onChangeSelectCity: ChangeEventHandler<HTMLSelectElement>;
}) => {
  const [currentUser, setCurrentUser] = useState(false);
  const [closeLoginModal, setCloseLoginModal] = useState(false);
  const [userImg, setUserImg] = useState<string | null>(null);
  const router = useRouter();
  console.log('router : ', router.route);
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
          <img src="/logo.png" />
        </Title>
      </Link>
      {router.route === '/main' ? (
        <CityCategory value={selectCity} onChange={onChangeSelectCity}>
          <option value="제주전체">제주전체</option>
          <option value="제주시">제주시</option>
          <option value="서귀포시">서귀포시</option>
        </CityCategory>
      ) : null}
      {/* 로그인, 로그아웃, 마이페이지 버튼 */}
      {closeLoginModal && <ModalLogin closeModal={closeLoginModalButton} />}
      {currentUser ? (
        <div onClick={() => router.push('/mypage')}>
          <Profile>
            {userImg ? (
              <ProfileImg src={userImg} />
            ) : (
              <ProfileImg src="/profileicon.svg" />
            )}
          </Profile>
        </div>
      ) : (
        <div onClick={closeLoginModalButton}>
          <Profile>
            <ProfileImg src="/profileicon.svg" />
          </Profile>
        </div>
      )}
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.div`
  background-color: white;
  /* position: relative; */
  display: flex;
  width: 1440px;
  margin: auto;
  padding: 0 37px 0 37px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  height: 70px;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.08);
  @media only screen and (max-width: 1400px) {
    width: 1200px;
  }
  @media only screen and (max-width: 900px) {
    width: 760px;
    margin-left: 35%;
  }
  @media only screen and (max-width: 600px) {
    width: 380px;
  }
`;
const Title = styled.div`
  width: 107px;
  font-weight: 900;
  font-size: 24px;
  cursor: pointer;
`;

const CityCategory = styled.select`
  text-align: center;
  background-color: inherit;
  font-size: 24px;
  border: none;
  border-radius: 20px;
  height: 40px;
`;
const Profile = styled.div`
  width: 107px;
  background-color: inherit;
`;
const ProfileImg = styled.img`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
`;
