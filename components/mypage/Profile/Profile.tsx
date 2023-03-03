import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { authService } from '@/firebase';
import { signOut } from 'firebase/auth';
import { customConfirm } from '@/utils/alerts';
import { useQuery } from 'react-query';
import { getTakeMessage, updateUser } from '@/api';
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import {
  messageBoxToggle,
  followingToggleAtom,
  followToggleAtom,
  editProfileModalAtom,
} from '@/atom';

const imgFile = '/profileicon.svg';

interface propsType {
  followingCount: number;
  followCount: number;
}

const Profile = ({ followingCount, followCount }: propsType) => {
  const [editProfileModal, setEditProfileModal] =
    useRecoilState(editProfileModalAtom);
  const [followingToggle, setfollowingToggle] =
    useRecoilState(followingToggleAtom);
  const [followToggle, setFollowToggle] = useRecoilState(followToggleAtom);
  const [msgToggle, setMsgToggle] = useRecoilState(messageBoxToggle);
  const profileimg = authService?.currentUser?.photoURL ?? imgFile;
  const [currentUser, setCurrentUser] = useState(false);
  const [userImg, setUserImg] = useState<string | null>(null);
  const nowUser = authService.currentUser;
  // console.log('nowUser,uid: ', nowUser?.uid);

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
    });
  };

  // 쪽지함 버튼에 확인하지 않은 메세지 표시
  const { data: takeMsgData } = useQuery(
    ['getTakeMessageData', nowUser?.uid],
    getTakeMessage
  );
  const checked = takeMsgData?.filter((item) => item.checked === false);

  return (
    <ProfileContainer>
      <ProfileEdit>
        {/* 사진 */}
        <div>
          <ProfileImage img={profileimg}></ProfileImage>
          {/* 프로필 수정 */}
          <ProfileEditBtn onClick={editProfileModalButton}>
            내 정보 변경 {'>'}
          </ProfileEditBtn>
        </div>
      </ProfileEdit>
      <ProfileText>
        <ProfileTextdiv>
          <ProfileNickname>
            {authService.currentUser?.displayName}님 {/* 닉네임 */}
            <Link href={'/main?city=제주전체'}>
              {/* 로그아웃 */}
              {authService.currentUser ? (
                <LogoutButton onClick={logOut}>로그아웃</LogoutButton>
              ) : null}
            </Link>
          </ProfileNickname>
          <SendMessage onClick={() => setMsgToggle(true)}>
            쪽지함/미확인{checked?.length}개
          </SendMessage>
        </ProfileTextdiv>

        <Follow>
          <MyProfileFollowing
            onClick={() => setfollowingToggle(!followingToggle)}
          >
            <FollowingText>팔로잉</FollowingText>
            <FollowingCount>{null ? '0' : followingCount}</FollowingCount>
          </MyProfileFollowing>
          <MyProfileFollower onClick={() => setFollowToggle(!followToggle)}>
            <FollowerText>팔로워</FollowerText>
            <FollowerCount>{null ? '0' : followCount}</FollowerCount>
          </MyProfileFollower>
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
`;
const ProfileEdit = styled.div``;
const ProfileImage = styled.div<{ img: string }>`
  width: 150px;
  height: 150px;
  border-radius: 100px;
  background-size: cover;
  background-image: url(${(props) => props.img});
  background-position: center center;
`;
const ProfileEditBtn = styled.button`
  font-family: Noto Sans CJK KR;
  border: none;
  background-color: transparent;
  color: #1882ff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding-top: 15px;
  padding-left: 35px;
  cursor: pointer;
`;
const ProfileText = styled.div`
  padding-right: 30px;
  width: 500px;
`;
const ProfileTextdiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  margin-left: 20px;
`;

const ProfileNickname = styled.span`
  font-family: Noto Sans CJK KR;
  width: 50%;
  height: 36px;
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  text-align: left;
  padding-left: 20px;
`;

const SendMessage = styled.button`
  background-color: white;
  border: 1px black solid;
  border-radius: 16px;
  cursor: pointer;
  transition: 0.5s;
  :hover {
    background-color: black;
    color: white;
    transition: 0.5s;
  }
`;
const LogoutButton = styled.button`
  font-family: Noto Sans CJK KR;
  color: #8e8e93;
  border: none;
  background-color: transparent;
  text-decoration-line: underline;
  font-weight: 400;
  font-size: 14px;
  width: 80px;
  height: 40px;
  cursor: pointer;
`;
const Follow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;
const MyProfileFollowing = styled.div`
  font-family: Noto Sans CJK KR;
  border-radius: 20px;
  background-color: #f8f8f8;
  padding: 11px 20px;
  width: 120px;
  height: 85px;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const FollowingText = styled.div`
  font-family: Noto Sans CJK KR;
  color: 5B5B5F;
  font-size: 20px;
  padding-top: 10px;
`;

const FollowingCount = styled.div`
  font-family: Noto Sans CJK KR;
  color: #212121;
  font-size: 20px;
  padding-top: 10px;
`;

const MyProfileFollower = styled.div`
  border-radius: 20px;
  background-color: #f8f8f8;
  padding: 11px 20px;
  width: 120px;
  height: 85px;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FollowerText = styled.div`
  font-family: Noto Sans CJK KR;
  color: 5B5B5F;
  font-size: 20px;
  padding-top: 10px;
`;

const FollowerCount = styled.div`
  font-family: Noto Sans CJK KR;
  color: #212121;
  font-size: 20px;
  padding: 10px;
`;
