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
import { resetAmplitude } from '@/utils/amplitude';

const imgFile = '/profileicon.svg';

interface propsType {
  followingCount: number;
  followerCount: number;
}

const Profile = ({ followingCount, followerCount }: propsType) => {
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
      resetAmplitude();
    });
  };

  // 쪽지함 버튼에 확인하지 않은 메세지 표시
  const { data: takeMsgData } = useQuery(
    ['getTakeMessageData', nowUser?.uid],
    getTakeMessage
  );
  const checked = takeMsgData?.filter((item) => item.checked === false);

  // console.log('followingCount: ', followingCount);
  // console.log('followCount: ', followCount);

  return (
    <ProfileContainer>
      {/* 사진 */}
      <div>
        <ProfileImage img={profileimg}></ProfileImage>
      </div>

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

          {/* <SendMessage onClick={() => setMsgToggle(true)}>
            쪽지함/미확인{checked?.length}개
          </SendMessage> */}
        </ProfileTextdiv>

        <Follow>
          <div onClick={() => setfollowingToggle(!followingToggle)}>
            <FollowerCount>
              {followingCount === undefined ? '0' : followingCount}팔로잉
              <FollowingOpenModal src="/open-arrow.png" alt="image" />
            </FollowerCount>
          </div>
          <FollowBtween>|</FollowBtween>
          <div onClick={() => setFollowToggle(!followToggle)}>
            <FollowerCount>
              {followerCount === undefined ? '0' : followerCount}팔로우
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
`;
const ProfileImage = styled.div<{ img: string }>`
  width: 120px;
  height: 120px;
  border-radius: 100px;
  background-size: cover;
  background-image: url(${(props) => props.img});
  background-position: center center;
`;

const ProfileText = styled.div`
  padding-left: 30px;
  width: 330px;
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

// const SendMessage = styled.button`
//   background-color: white;
//   border: 1px black solid;
//   border-radius: 16px;
//   cursor: pointer;
//   transition: 0.5s;
//   :hover {
//     background-color: black;
//     color: white;
//     transition: 0.5s;
//   }
// `;

const Follow = styled.div`
  font-size: 16px;
  font-family: Noto Sans CJK KR;
  color: #5b5b5f;
  display: flex;
  text-align: left;
  align-items: center;
  gap: 16px;
`;

const FollowerCount = styled.div`
  font-size: 16px;
  font-family: Noto Sans CJK KR;
  color: #5b5b5f;
  padding-top: 10px;
`;

const FollowBtween = styled.div`
  font-size: 25px;
  font-family: Noto Sans CJK KR;
  color: #d9d9d9;
  padding-top: 10px;
`;
