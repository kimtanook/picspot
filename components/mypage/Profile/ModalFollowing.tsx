import { deleteFollowing, getFollowing, getUser } from '@/api';
import { authService } from '@/firebase';
import Image from 'next/image';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { editProfileModalAtom, followingToggleAtom } from '@/atom';
import { logEvent } from '@amplitude/analytics-browser';
import { useMediaQuery } from 'react-responsive';

interface ItemType {
  uid: string;
  userName: string;
  userImg: string;
}

const ModalFollowing = () => {
  const profileImage = authService.currentUser?.photoURL as string;
  const isMobile = useMediaQuery({ maxWidth: 766 });
  const isPc = useMediaQuery({ minWidth: 767 });
  const [followingToggle, setfollowingToggle] =
    useRecoilState(followingToggleAtom);
  const queryClient = useQueryClient();

  //* following에서 uid와 현재 uid가 같은 following만 뽑기
  const {
    data: followingData,
    isLoading,
    isError,
  } = useQuery('FollowingData', getFollowing, {
    select: (data) =>
      data?.find((item: any) => item.docId === authService.currentUser?.uid)
        ?.following,
  });

  //* user에서 내가 팔로우한 사람 데이터 뽑기
  const { data: userData } = useQuery('UserData', getUser, {
    select: (data) =>
      data?.filter((item: any) => followingData?.includes(item.uid)),
  });

  //* mutation 사용해서 팔로잉, 팔로우 삭제 데이터 보내기
  const { mutate: deleteFollowingMutate } = useMutation(deleteFollowing, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries('FollowingData'), 500);
      setTimeout(() => queryClient.invalidateQueries('UserData'), 500);
    },
    onError: () => {},
  });

  //* 언팔로잉 버튼 눌렀을때 실행하는 함수
  const onClickDeleteFollowing = (item: any) => {
    deleteFollowingMutate({ ...item, uid: authService.currentUser?.uid });
    logEvent('언팔로잉 버튼', { from: 'mypage following modal' });
  };

  //* 팔로잉한 사람 버튼을 눌렀을때 실행하는 함수
  const router = useRouter();
  const onClickFollowing = (item: any) => {
    setfollowingToggle(!followingToggle);
    router.push(`/userprofile/${item.uid}`);
  };

  if (isLoading) return <h1>로딩 중입니다.</h1>;
  if (isError) return <h1>연결이 원활하지 않습니다.</h1>;

  return (
    <FollowingContainer>
      <Heder>
        {isMobile && (
          <ProfileEditCancleBtn
            onClick={() => {
              setfollowingToggle(!followingToggle);
            }}
            src={'/Back-point.png'}
          />
        )}
        {isPc && (
          <CancleBtn
            onClick={() => {
              setfollowingToggle(!followingToggle);
            }}
          >
            〈 취소{' '}
          </CancleBtn>
        )}
      </Heder>
      {isMobile && <FollowText>팔로잉 목록</FollowText>}
      <FollowingList>
        <FollowingTotal>
          <ProfileImg src={profileImage} />
          <UserNicknameFollow>
            <UserNickname>{authService.currentUser?.displayName}</UserNickname>
            님이 팔로잉중인 사람
          </UserNicknameFollow>
        </FollowingTotal>
      </FollowingList>
      {userData?.map((item: ItemType) => (
        <FollowingProfile key={item.uid}>
          <FollowingUser onClick={() => onClickFollowing(item)}>
            <Image
              src={item.userImg}
              alt="image"
              width={40}
              height={40}
              style={{
                borderRadius: '50%',
              }}
            />
            <FollowingUserName>{item.userName}</FollowingUserName>
          </FollowingUser>
          <FollowingBtn onClick={() => onClickDeleteFollowing(item)}>
            언팔로잉
          </FollowingBtn>
        </FollowingProfile>
      ))}
    </FollowingContainer>
  );
};

export default ModalFollowing;

const FollowingContainer = styled.div`
  height: 650px;
`;

const Heder = styled.header`
  height: 20px;
  @media ${(props) => props.theme.mobile} {
    margin: 30px 0px 0px 95px;
  }
`;

const CancleBtn = styled.button`
  cursor: pointer;
  color: #1882ff;
  font-size: 14px;
  margin-left: 25px;
  background-color: white;
  border: 0px;
`;
const FollowText = styled.div`
  text-align: center;
  position: absolute;
  left: 40%;
  top: 5.8%;
  font-weight: 700;
  font-size: 20px;
  line-height: 138.5%;
`;

const ProfileEditCancleBtn = styled.img`
  width: 12px;
  height: 28px;
`;

const FollowingList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 25%;
  width: 524px;
  margin-bottom: 32px;
  box-shadow: 0px 12px 15px rgba(0, 0, 0, 0.08);
  @media ${(props) => props.theme.mobile} {
    margin-top: 20px;
    height: 20%;
  }
`;

const FollowingTotal = styled.div`
  border-radius: 50px;
  background-color: #f8f8f8;
  width: 300px;
  height: 68px;
  text-align: center;
  margin-bottom: 30px;
  gap: 10px;
  display: flex;
  align-items: center;
`;

const ProfileImg = styled.img`
  width: 52px;
  height: 52px;
  border-radius: 30px;
  margin: 15px;
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

const FollowingProfile = styled.div`
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

const FollowingUser = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const FollowingUserName = styled.div`
  margin-left: 10px;
  font-size: 20px;
`;

const FollowingBtn = styled.div`
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
