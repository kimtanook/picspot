import {
  addFollowing,
  deleteFollowing,
  getFollow,
  getFollowing,
  getUser,
} from '@/api';
import { followToggleAtom } from '@/atom';
import { authService } from '@/firebase';
import { logEvent } from '@/utils/amplitude';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useMediaQuery } from 'react-responsive';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

interface ItemType {
  uid: string;
  userName: string;
  userImg: string;
}

const ModalFollow = () => {
  const profileImage = authService.currentUser?.photoURL as string;
  const isMobile = useMediaQuery({ maxWidth: 766 });
  const isPc = useMediaQuery({ minWidth: 767 });

  const queryClient = useQueryClient();
  const [followToggle, setFollowToggle] = useRecoilState(followToggleAtom);

  //! follow 핸들링 //////////////////////////////////////////////////////
  //* follow에서 docId와 현재 uid가 같은 follow만 뽑기
  const {
    data: followData,
    isLoading,
    isError,
  } = useQuery('FollowData', getFollow, {
    select: (data) =>
      data?.filter(
        (item: any) => item.docId === authService.currentUser?.uid
      )[0]?.follow,
  });

  //* user에서 나를 팔로우한 사람 데이터 뽑기
  const { data: followUserData } = useQuery('UserData', getUser, {
    select: (data) =>
      data?.filter((item: any) => followData?.includes(item.uid)),
  });

  //* mutation 사용해서 팔로잉 추가 데이터 보내기
  const { mutate: followingMutate } = useMutation(addFollowing, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries('FollowingData'), 500);
      setTimeout(() => queryClient.invalidateQueries('UserData'), 500);
      setTimeout(() => queryClient.invalidateQueries('FollowData'), 500);
    },
    onError: () => {},
  });

  //* mutation 사용해서 팔로잉 삭제 데이터 보내기
  const { mutate: deleteFollowingMutate } = useMutation(deleteFollowing, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries('FollowingData'), 500);
      setTimeout(() => queryClient.invalidateQueries('UserData'), 500);
      setTimeout(() => queryClient.invalidateQueries('FollowData'), 500);
    },
    onError: () => {},
  });

  //! following 핸들링 ///////////////////////////////////////////////////
  //* following에서 uid와 현재 uid가 같은 following만 뽑기
  const { data: followingData } = useQuery('FollowingData', getFollowing, {
    select: (data) =>
      data?.find((item: any) => item.docId === authService.currentUser?.uid)
        ?.following,
  });

  //* user에서 내가 팔로우한 사람 데이터 뽑기
  const { data: followingUserData } = useQuery('UserData', getUser, {
    select: (data) =>
      data?.filter((item: any) => followingData?.includes(item.uid)),
  });

  //* 나를 팔로우한 사람과 내가 팔로잉한 사람의 uid가 담긴 배열
  const CommonUidArr = followUserData
    ?.filter((item: any) => followingData?.includes(item.uid))
    .map((item: any) => item.uid);

  //* 팔로잉 버튼을 눌렀을때 실행하는 함수
  const onClickFollowingBtn = (item: any) => {
    followingMutate({ ...item, uid: authService?.currentUser?.uid });
    logEvent('팔로잉 버튼', { from: 'mypage follow modal' });
  };

  //* 언팔로잉 버튼을 눌렀을때 실행하는 함수
  const onClickDeleteFollowingBtn = (item: any) => {
    deleteFollowingMutate({ ...item, uid: authService?.currentUser?.uid });
    logEvent('언팔로잉 버튼', { from: 'mypage follow modal' });
  };

  //* 팔로우한 사람 버튼을 눌렀을때 실행하는 함수
  const router = useRouter();
  const onClickFollow = (item: any) => {
    setFollowToggle(!followToggle);
    router.push(`/userprofile/${item.uid}`);
  };

  if (isLoading) return <h1>로딩 중입니다.</h1>;
  if (isError) return <h1>연결이 원활하지 않습니다.</h1>;

  return (
    <FollowContainer>
      <Heder>
        {isMobile && (
          <ProfileEditCancleBtn
            onClick={() => {
              setFollowToggle(!followToggle);
            }}
            src={'/Back-point.png'}
          />
        )}
        {isPc && (
          <CancleBtn
            onClick={() => {
              setFollowToggle(!followToggle);
            }}
          >
            〈 취소{' '}
          </CancleBtn>
        )}
      </Heder>
      {isMobile && <FollowText>팔로우 목록</FollowText>}

      <FollowList>
        <FollowTotal>
          <ProfileImg src={profileImage} />
          <UserNicknameFollow>
            <UserNickname>{authService.currentUser?.displayName}</UserNickname>
            님을 팔로우 하는 사람
          </UserNicknameFollow>
        </FollowTotal>
      </FollowList>
      {followUserData?.map((item: ItemType) => (
        <FollowProfile key={item.uid}>
          <FollowUser onClick={() => onClickFollow(item)}>
            <Image
              src={item.userImg}
              alt="image"
              width={40}
              height={40}
              style={{
                borderRadius: '50%',
              }}
            />
            <FollowUserName>{item.userName}</FollowUserName>
          </FollowUser>
          {CommonUidArr.find((item2: any) => item2 === item.uid) ? (
            <FollowBtn onClick={() => onClickDeleteFollowingBtn(item)}>
              언팔로잉
            </FollowBtn>
          ) : (
            <FollowBtn onClick={() => onClickFollowingBtn(item)}>
              팔로잉
            </FollowBtn>
          )}
        </FollowProfile>
      ))}
    </FollowContainer>
  );
};

export default ModalFollow;

const FollowContainer = styled.div`
  height: 650px;
`;

const Heder = styled.div`
  height: 20px;
  width: 90px;
  @media ${(props) => props.theme.mobile} {
    margin: 30px 0px 0px 95px;
  }
`;

const FollowText = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 20px;
  line-height: 138.5%;
  position: absolute;
  left: 40%;
  top: 5.8%;
`;

const ProfileEditCancleBtn = styled.img`
  width: 12px;
  height: 28px;
`;

const CancleBtn = styled.button`
  cursor: pointer;
  color: #1882ff;
  font-size: 14px;
  margin-left: 25px;
  background-color: white;
  border: 0px;
`;

const FollowList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 25%;
  width: 524px;
  margin-bottom: 32px;
  box-shadow: 0px 12px 15px rgba(0, 0, 0, 0.08);
  @media ${(props) => props.theme.mobile} {
    height: 20%;
    margin-top: 20px;
  }
`;

const FollowTotal = styled.div`
  border-radius: 40px;
  background-color: #f8f8f8;
  width: 300px;
  height: 68px;
  text-align: center;
  margin-bottom: 30px;
  gap: 10px;
  display: flex;
  align-items: center;
`;

const UserNicknameFollow = styled.div`
  display: flex;
  font-family: 'Noto Sans CJK KR';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.01em;
`;

const UserNickname = styled.div`
  font-family: 'Noto Sans CJK KR';
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 24px;
  letter-spacing: -0.01em;
`;

const ProfileImg = styled.img`
  width: 52px;
  height: 52px;
  border-radius: 50px;
  margin: 15px;
`;

const FollowProfile = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 400px;
  overflow-y: scroll;
  margin: auto;
  border-bottom: 2px solid #f4f4f4;
  padding: 10px 0px 10px 0px;
  @media ${(props) => props.theme.mobile} {
    width: 85vw;
  }
`;

const FollowUser = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const FollowBtn = styled.div`
  cursor: pointer;
  background-color: #4cb2f6;
  color: white;
  font-size: 12px;
  width: 62px;
  height: 28px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  @media ${(props) => props.theme.mobile} {
    margin-right: 0px;
  }
`;
const FollowUserName = styled.div`
  margin-left: 10px;
  font-size: 20px;
`;
