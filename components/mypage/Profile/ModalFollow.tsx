import {
  addFollowing,
  deleteFollowing,
  getFollow,
  getFollowing,
  getUser,
} from '@/api';
import { followToggleAtom } from '@/atom';
import { authService } from '@/firebase';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

interface ItemType {
  uid: string;
  userName: string;
  userImg: string;
}

const ModalFollow = () => {
  // console.log('authService.currentUser?.uid', authService.currentUser?.uid);

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
  // console.log('followData: ', followData);
  const followCount = followData?.length; //* 나를 팔로잉 하는 사람 숫자

  //* user에서 나를 팔로우한 사람 데이터 뽑기
  const { data: followUserData } = useQuery('UserData', getUser, {
    select: (data) =>
      data?.filter((item: any) => followData?.includes(item.uid)),
  });
  // console.log('followUserData: ', followUserData);

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
      data?.find((item: any) => item.uid === authService.currentUser?.uid)
        ?.following,
  });
  // console.log('followingData: ', followingData);

  //* user에서 내가 팔로우한 사람 데이터 뽑기
  const { data: followingUserData } = useQuery('UserData', getUser, {
    select: (data) =>
      data?.filter((item: any) => followingData?.includes(item.uid)),
  });
  // console.log('followingUserData: ', followingUserData);

  //* 나를 팔로우한 사람과 내가 팔로잉한 사람의 uid가 담긴 배열
  const CommonUidArr = followUserData
    ?.filter((item: any) => followingData?.includes(item.uid))
    .map((item: any) => item.uid);
  // console.log('CommonUidArr: ', CommonUidArr);

  //* 팔로잉 버튼을 눌렀을때 실행하는 함수
  const onClickFollowingBtn = (item: any) => {
    console.log('item: ', item);
    followingMutate({ ...item, uid: authService?.currentUser?.uid });
  };

  //* 언팔로잉 버튼을 눌렀을때 실행하는 함수
  const onClickDeleteFollowingBtn = (item: any) => {
    console.log('item: ', item);
    deleteFollowingMutate({ ...item, uid: authService?.currentUser?.uid });
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
      <FollowList>
        <div style={{ fontSize: 30, marginBottom: 20 }}>내 팔로워 목록</div>
        <FollowTotal>
          <FollowText>팔로워</FollowText>
          <FollowCount>{null ? '0' : followCount}</FollowCount>
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

const FollowList = styled.div`
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

const FollowTotal = styled.div`
  border-radius: 20px;
  background-color: #f8f8f8;
  padding: 11px 20px;
  width: 120px;
  height: 70px;
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
`;

const FollowText = styled.div`
  color: #5b5b5f;
  padding-top: 10px;
`;

const FollowCount = styled.div`
  color: #212121;
  font-size: 20px;
  padding-top: 10px;
`;

const FollowProfile = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 340px;
  overflow-y: scroll;
  margin: auto;
  padding-bottom: 20px;
`;

const FollowUser = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const FollowUserName = styled.div`
  margin-left: 10px;
  font-size: 20px;
`;

const FollowBtn = styled.div`
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
