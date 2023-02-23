import { addFollowing, deleteFollwing, getFollwing } from '@/api';
import { authService } from '@/firebase';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import styled from 'styled-components';

const FollowingButton = ({ item }: any) => {
  //* 팔로잉 버튼 토글
  const [follwingUserAndCreatorUidState, setFollwingUserAndCreatorUidState] =
    useState(false);

  //* mutation 사용해서 팔로잉 데이터 보내기
  const { mutate: follwingMutate } = useMutation(addFollowing);

  //* 팔로잉버튼 눌렀을때 실행하는 함수
  const onClickFollowingBtn = (item: any) => {
    follwingMutate({ ...item, uid: authService?.currentUser?.uid });
    setFollwingUserAndCreatorUidState(!follwingUserAndCreatorUidState);
  };

  //* mutation 사용해서 팔로잉 삭제 데이터 보내기
  const { mutate: deleteFollowingMutate } = useMutation(deleteFollwing);

  //* 팔로잉삭제 버튼 눌렀을때 실행하는 함수
  const onClickDeleteFollwing = (item: any) => {
    deleteFollowingMutate({ ...item, uid: authService?.currentUser?.uid });
    setFollwingUserAndCreatorUidState(!follwingUserAndCreatorUidState);
  };

  //* useQuery 사용해서 following 데이터 불러오기
  const {
    data: followingData,
    isLoading,
    isError,
  } = useQuery('followingData', getFollwing);

  //? 팔로잉한 사람 uid를 배열에 담았습니다.
  const authFollowingUid = followingData
    ?.filter((item: any) => {
      return item.uid === authService.currentUser?.uid;
    })
    .find((item: any) => {
      return item.follow;
    })?.follow;

  //! 기능
  //* 팔로잉을 한 유저가 페이지에 들어왔을때 팔로잉 취소버튼이,
  //* 팔로잉을 하지 않은 유저가 페이지에 들어왔을때 팔로잉 버튼이 보이도록 했습니다.
  useEffect(() => {
    //! 로직 : indexOf 사용
    //* 내가 팔로잉한 사람들의 uid가 들어가 배열안에
    //* 해당 게시물을 만든 사람의 uid가 있는 인덱스를 뽑았습니다.
    //* 만약 uid가 없다면 팔로잉 버튼을 있다면 팔로잉 취소 버튼이 보이도록 했습니다.
    if (authFollowingUid?.indexOf(item.creator) === -1) {
      setFollwingUserAndCreatorUidState(false);
    } else {
      setFollwingUserAndCreatorUidState(true);
    }
  }, [authFollowingUid, item.creator]);

  //* 팔로우가 없는 유저가 처음 페이지에 들어왔을때 팔로잉 상태를 최신화했습니다.
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
            onClick={() => onClickDeleteFollwing(item)}
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
  background-color: #8e8e93;
  border-radius: 30px;
  /* width: 60px; */
  height: 20px;
  text-align: center;
  color: white;
  cursor: pointer;
  padding-top: 5px;
  :hover {
    background-color: #4cb2f6;
  }
  font-size: 12px;
`;
