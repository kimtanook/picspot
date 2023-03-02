import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { authService, storageService } from '@/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { uploadString, getDownloadURL, ref } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { customAlert } from '@/utils/alerts';
import { useMutation, useQuery } from 'react-query';
import { getTakeMessage, updateUser } from '@/api';
import Link from 'next/link';
import ModalProfile from './ModalProfile';
import { useRecoilState } from 'recoil';
import {
  messageBoxToggle,
  followingToggleAtom,
  followToggleAtom,
} from '@/atom';

const imgFile = '/profileicon.svg';

interface propsType {
  followingCount: number;
  followCount: number;
}

const Profile = ({ followingCount, followCount }: propsType) => {
  const [followingToggle, setfollowingToggle] =
    useRecoilState(followingToggleAtom);
  const [followToggle, setFollowToggle] = useRecoilState(followToggleAtom);

  const [msgToggle, setMsgToggle] = useRecoilState(messageBoxToggle);
  const profileimg = authService?.currentUser?.photoURL ?? imgFile;
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [imgEdit, setImgEdit] = useState<string>(profileimg);
  const [currentUser, setCurrentUser] = useState(false);
  const [nicknameEdit, setNicknameEdit] = useState<string>(
    authService?.currentUser?.displayName as string
  );
  const [userImg, setUserImg] = useState<string | null>(null);
  const nowUser = authService.currentUser;

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
      // localStorage.clear();
      setCurrentUser(false);
      customAlert('로그아웃에 성공하였습니다!');
      localStorage.removeItem('googleUser');
    });
  };
  // 전체 프로필 수정을 취소하기
  const profileEditCancle = () => {
    setImgEdit((authService?.currentUser?.photoURL as string) ?? imgFile);
    setNicknameEdit(authService?.currentUser?.displayName as string);
    setEditProfileModal(!editProfileModal);
  };

  // 쪽지함 버튼에 확인하지 않은 메세지 표시
  const { data: takeMsgData } = useQuery(
    ['getTakeMessageData', nowUser?.uid],
    getTakeMessage
  );
  const checked = takeMsgData?.filter((item) => item.checked === false);

  return (
    <ProfileContainer>
      {/* 프로필 수정 버튼 props */}
      {editProfileModal && (
        <ModalProfile
          profileEditCancle={profileEditCancle}
          editProfileModal={editProfileModalButton}
          imgEdit={imgEdit}
          setImgEdit={setImgEdit}
          nicknameEdit={nicknameEdit}
        />
      )}
      <ProfileEdit>
        {/* 사진 */}
        <div>
          <ProfileImage img={imgEdit}></ProfileImage>
          {/* 프로필 수정 */}
          <ProfileEditBtn onClick={editProfileModalButton}>
            내 정보 변경 {'>'}
          </ProfileEditBtn>
        </div>
      </ProfileEdit>
      <ProfileText>
        <ProfileTextdiv>
          {/* 닉네임 */}
          <ProfileNickname>
            {authService.currentUser?.displayName}님{/* 로그아웃 */}
            <Link href={'/main?city=제주전체'}>
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
  width: 100%;
`;
const ProfileTextdiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;
const ProfileNickname = styled.span`
  font-family: Noto Sans CJK KR;
  width: 70%;
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
  width: 90px;
  height: 85px;
  text-align: center;
  cursor: pointer;
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
  width: 90px;
  height: 85px;
  text-align: center;
  cursor: pointer;
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
