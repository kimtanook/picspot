import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { authService } from '@/firebase';
import { signOut } from 'firebase/auth';
import { customConfirm } from '@/utils/alerts';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import {
  followingToggleAtom,
  followToggleAtom,
  editProfileModalAtom,
} from '@/atom';
import { resetAmplitude } from '@/utils/amplitude';
import { useMediaQuery } from 'react-responsive';
import { getRouteRegex } from 'next/dist/shared/lib/router/utils/route-regex';

const imgFile = '/profileicon.svg';

interface propsType {
  followingCount: number | undefined;
  followerCount: number | undefined;
}

const Profile = ({ followingCount, followerCount }: propsType) => {
  const [editProfileModal, setEditProfileModal] =
    useRecoilState(editProfileModalAtom);
  const [followingToggle, setfollowingToggle] =
    useRecoilState(followingToggleAtom);
  const [followToggle, setFollowToggle] = useRecoilState(followToggleAtom);
  const [isOpen, setIsOpen] = useState(false);
  const profileimg = authService?.currentUser?.photoURL ?? imgFile;
  const [currentUser, setCurrentUser] = useState(false);
  const [userImg, setUserImg] = useState<string | null>(null);
  const nowUser = authService.currentUser;
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 785 });

  // 프로필 수정 모달 창 버튼
  const editProfileModalButton = () => {
    setEditProfileModal(!editProfileModal);
  };

  useEffect(() => {
    if (authService.currentUser) {
      setCurrentUser(true);
      setUserImg(authService.currentUser.photoURL);
    }
  }, [nowUser]);

  // 로그아웃
  const logOut = () => {
    signOut(authService).then(() => {
      // Sign-out successful.
      setCurrentUser(false);
      customConfirm('로그아웃에 성공하였습니다!');
      localStorage.removeItem('googleUser');
      resetAmplitude();
      getRouteRegex;
      router.push('/main?city=제주전체');
    });
  };

  return (
    <ProfileContainer>
      <>
        {isMobile && (
          <Link href="/main?city=제주전체">
            <Back
              onClick={() => {
                // sessionStorage.clear();
                localStorage.clear();
              }}
            >
              <MobileBack src="/Back-point.png" alt="image" />
            </Back>
          </Link>
        )}
      </>
      {isMobile && <HeaderText>마이페이지</HeaderText>}
      <div>
        <div onClick={() => setIsOpen(!isOpen)}>
          <MenuPointImg src="/three-point.png" />
        </div>
        {isOpen === true ? (
          <Menu>
            <MenuItem onClick={editProfileModalButton}>내 정보 변경</MenuItem>
            <MenuItem onClick={logOut}>로그아웃</MenuItem>
          </Menu>
        ) : null}
      </div>
      {/* 사진 */}
      <ProfileImageDiv>
        <ProfileImage img={profileimg}></ProfileImage>
      </ProfileImageDiv>
      <ProfileText>
        <ProfileTextdiv>
          <ProfileNickname>
            {authService.currentUser?.displayName}님 {/* 닉네임 */}
            <Link href={'/main?city=제주전체'}>
              {/* 로그아웃 */}
              {authService.currentUser ? (
                <LogoutProfileButton onClick={logOut}>
                  로그아웃
                </LogoutProfileButton>
              ) : null}
            </Link>
            {/* 프로필 수정 */}
            <LogoutProfileButton onClick={editProfileModalButton}>
              내 정보 변경
              <ChangeOpenModal src="/open-arrow.png" alt="image" />
            </LogoutProfileButton>
          </ProfileNickname>
        </ProfileTextdiv>
        <Follow>
          <div onClick={() => setFollowToggle(!followToggle)}>
            <FollowerCount>
              {followerCount === undefined ? '0' : followerCount} 팔로워
            </FollowerCount>
          </div>
          <FollowBtween>|</FollowBtween>
          <div onClick={() => setfollowingToggle(!followingToggle)}>
            <FollowerCount>
              {followingCount === undefined ? '0' : followingCount} 팔로잉
              <FollowingOpenModal src="/open-arrow.png" alt="image" />
            </FollowerCount>
          </div>
        </Follow>
      </ProfileText>
    </ProfileContainer>
  );
};
export default Profile;

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 4vw;
  @media ${(props) => props.theme.mobile} {
    width: 100vw;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-left: 20px;
  }
`;
const Back = styled.div`
  position: absolute;
  transform: translate(10%, -350%);
`;
const MobileBack = styled.img`
  width: 12px;
  height: 22px;
`;
const HeaderText = styled.div`
  font-size: 20px;
  font-weight: bold;
  font-family: Noto Sans CJK KR;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(0%, -320%);
`;

const MenuPointImg = styled.img`
  display: none;
  @media ${(props) => props.theme.mobile} {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translate(8200%, -550%);
  }
`;

const Menu = styled.div`
  @media ${(props) => props.theme.mobile} {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    left: 63vw;
    top: 3vh;
    font-size: 13px;
    border: 1px solid #d9d9d9;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.21);
    width: 88px;
    height: 90px;
    place-content: center;
    gap: 19px;
    background-color: #f4f4f4;
  }
`;
const MenuItem = styled.div`
  display: none;
  @media ${(props) => props.theme.mobile} {
    display: flex;
  }
`;

const ProfileImageDiv = styled.div`
  @media ${(props) => props.theme.mobile} {
    margin-left: 20px;
  }
`;

const ProfileImage = styled.div<{ img: string }>`
  width: 120px;
  height: 120px;
  border-radius: 100px;
  background-size: cover;
  background-image: url(${(props) => props.img});
  background-position: center center;
  @media ${(props) => props.theme.mobile} {
    width: 112px;
    height: 112px;
  }
`;

const ProfileText = styled.div`
  padding-left: 55px;
  width: 100%;
  @media ${(props) => props.theme.mobile} {
    padding-left: 25px;
  }
`;
const ProfileTextdiv = styled.div`
  display: flex;
  justify-content: left;
  padding-bottom: 5px;
`;

const ProfileNickname = styled.span`
  font-family: Noto Sans CJK KR;
  color: #212121;
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  text-align: left;
  @media ${(props) => props.theme.mobile} {
    font-size: 18px;
  }
`;
const LogoutProfileButton = styled.button`
  font-family: Noto Sans CJK KR;
  border: none;
  background-color: transparent;
  color: #5b5b5f;
  text-decoration-line: underline;
  font-size: 14px;
  display: inline-flex;
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
`;
const ChangeOpenModal = styled.img`
  background-color: transparent;
  padding-left: 7px;
  width: 15px;
  height: 14px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const FollowingOpenModal = styled.img`
  background-color: transparent;
  padding-left: 7px;
  width: 17px;
  height: 16px;
  cursor: pointer;
`;

const Follow = styled.div`
  font-size: 16px;
  font-family: Noto Sans CJK KR;
  color: #5b5b5f;
  display: flex;
  text-align: left;
  align-items: center;
  gap: 16px;
  @media ${(props) => props.theme.mobile} {
    font-size: 14px;
  }
`;

const FollowerCount = styled.div`
  font-size: 16px;
  font-family: Noto Sans CJK KR;
  color: #5b5b5f;
  padding-top: 10px;
  @media ${(props) => props.theme.mobile} {
    font-size: 14px;
  }
`;

const FollowBtween = styled.div`
  font-size: 25px;
  font-family: Noto Sans CJK KR;
  color: #d9d9d9;
  padding-top: 10px;
  @media ${(props) => props.theme.mobile} {
    font-size: 14px;
  }
`;
