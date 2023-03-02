import {
  addFollow,
  addFollowing,
  deleteFollow,
  deleteFollowing,
  getFollowing,
  updateUser,
} from '@/api';
import { authService } from '@/firebase';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import styled from 'styled-components';

const FollowingButton = ({ item }: any) => {
  //* 팔로잉 버튼 토글
  const [follwingUserAndCreatorUidState, setFollwingUserAndCreatorUidState] =
    useState(false);

  //* mutation 사용해서 팔로잉, 팔로우 데이터 보내기, user 데이터 보내기
  const { mutate: followingMutate } = useMutation(addFollowing);
  const { mutate: followMutate } = useMutation(addFollow);
  const { mutate: userMutate } = useMutation(updateUser);

  //* creator user 데이터
  const creatorUserData: any = {
    uid: item.creator,
    creator: item.creator,
  };

  //* auth user 데이터
  const authUserData: any = {
    uid: authService.currentUser?.uid,
    creator: authService.currentUser?.uid,
  };

  //* 팔로잉버튼 눌렀을때 실행하는 함수
  const onClickFollowingBtn = (item: any) => {
    followingMutate({ ...item, uid: authService?.currentUser?.uid });
    followMutate({ ...item, uid: authService?.currentUser?.uid });
    userMutate(creatorUserData);
    userMutate(authUserData);
    setFollwingUserAndCreatorUidState(!follwingUserAndCreatorUidState);
  };

  //* mutation 사용해서 팔로잉, 팔로우 삭제 데이터 보내기
  const { mutate: deleteFollowingMutate } = useMutation(deleteFollowing);
  const { mutate: deleteFollowMutate } = useMutation(deleteFollow);

  //* 팔로잉삭제 버튼 눌렀을때 실행하는 함수
  const onClickDeleteFollowing = (item: any) => {
    deleteFollowingMutate({ ...item, uid: authService?.currentUser?.uid });
    deleteFollowMutate({ ...item, uid: authService?.currentUser?.uid });
    setFollwingUserAndCreatorUidState(!follwingUserAndCreatorUidState);
  };

  //* useQuery 사용해서 following 데이터 불러오기
  const {
    data: followingData,
    isLoading,
    isError,
  } = useQuery('FollowingData', getFollowing);

  //? 팔로잉한 사람 uid를 배열에 담았습니다.
  const authFollowingUid = followingData
    ?.filter((item: any) => {
      return item.uid === authService.currentUser?.uid;
    })
    .find((item: any) => {
      return item.following;
    })?.following;

  //* 팔로잉을 한 유저가 페이지에 들어왔을때 팔로잉 취소버튼이,
  //* 팔로잉을 하지 않은 유저가 페이지에 들어왔을때 팔로잉 버튼이 보이도록 하기
  useEffect(() => {
    if (authFollowingUid?.indexOf(item.creator) === -1) {
      setFollwingUserAndCreatorUidState(false);
    } else {
      setFollwingUserAndCreatorUidState(true);
    }
  }, [authFollowingUid, item.creator]);

  //* 팔로우가 없는 유저가 처음 페이지에 들어왔을때 팔로잉 상태 최신화하기
  useEffect(() => {
    if (authFollowingUid === undefined) {
      setFollwingUserAndCreatorUidState(false);
    }
  }, []);

  if (isLoading) return <h1>로딩중 입니다</h1>;
  if (isError) return <h1>통신이 불안정합니다</h1>;

  //* 팔로우한 사람은 팔로우 삭제 버튼이 팔로우 하지 않은 사람은 팔로우 추가 버튼을 보이도록 하기
  //* 비회원 or 자기 자신 포스트에는 팔로잉 버튼이 안보이도록 하기
  if (
    authService.currentUser &&
    authService.currentUser?.uid !== item.creator
  ) {
    return (
      <StFollowingContainer>
        {follwingUserAndCreatorUidState ? (
          <StFollowingBtn
            onClick={() => onClickDeleteFollowing(item)}
            style={{ width: 80 }}
          >
            팔로잉 삭제
          </StFollowingBtn>
        ) : (
          <StFollowingBtn
            onClick={() => onClickFollowingBtn(item)}
            style={{ width: 60 }}
          >
            팔로잉
          </StFollowingBtn>
        )}
      </StFollowingContainer>
    );
  }
  return <div></div>;
};

export default FollowingButton;

const StFollowingContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StFollowingBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #8e8e93;
  border-radius: 30px;
  height: 30px;
  text-align: center;
  color: white;
  cursor: pointer;
  :hover {
    background-color: #4cb2f6;
  }
  font-size: 12px;
`;
