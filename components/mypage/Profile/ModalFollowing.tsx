import { deleteFollowing, getFollowing, getUser } from '@/api';
import { authService } from '@/firebase';
import Image from 'next/image';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { followingToggleAtom } from '@/atom';

interface ItemType {
  uid: string;
  userName: string;
  userImg: string;
}

const ModalFollowing = () => {
  // console.log('authService.currentUser?.uid: ', authService.currentUser?.uid);
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
      data?.find((item: any) => item.uid === authService.currentUser?.uid)
        ?.following,
  });
  // console.log('followingData: ', followingData);
  const followingCount = followingData?.length; //* 내가 팔로잉 하는 사람 숫자

  //* user에서 내가 팔로우한 사람 데이터 뽑기
  const { data: userData } = useQuery('UserData', getUser, {
    select: (data) =>
      data?.filter((item: any) => followingData?.includes(item.uid)),
  });
  // console.log('userData: ', userData);

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
      <FollowingList>
        <div style={{ fontSize: 30, marginBottom: 20 }}>내 팔로잉 목록</div>
        <FollowingTotal>
          <FollowingText>팔로잉</FollowingText>
          <FollowingCount>{null ? '0' : followingCount}</FollowingCount>
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

const FollowingList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
  height: 30%;
  width: 400px;
  margin-bottom: 40px;
  border-bottom: 1px solid black;
`;

const FollowingTotal = styled.div`
  border-radius: 20px;
  background-color: #f8f8f8;
  padding: 11px 20px;
  width: 120px;
  height: 70px;
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
`;

const FollowingText = styled.div`
  color: #5b5b5f;
  padding-top: 10px;
`;

const FollowingCount = styled.div`
  color: #212121;
  font-size: 20px;
  padding-top: 10px;
`;

const FollowingProfile = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 340px;
  overflow-y: scroll;
  margin: auto;
  padding-bottom: 20px;
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
  width: 60px;
  height: 30px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
`;
