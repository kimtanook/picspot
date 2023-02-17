import { addFollowing, deleteFollwing, getFollwing } from '@/api';
import { authService } from '@/firebase';
import { calculateSizeAdjustValues } from 'next/dist/server/font-utils';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import styled from 'styled-components';

// 팔로우가 있으면 스테이트를 true 없으면 false
// 팔로우를 조회해서 커런트 유ㅈ저가 겹치는게 있으면

const FollowingButton = ({ item }: any) => {
  //! FollwingUserAndCreatorUid를 state로 만들어 변경 시 마다 팔로잉, 팔로잉 삭제 버튼 바로 렌더링 되게하기
  const [follwingUserAndCreatorUidState, setFollwingUserAndCreatorUidState] =
    useState(false);

  console.log(authService.currentUser?.uid);

  // useEffect(() => {
  //   if (follwingUserAndCreatorUid) {
  //     setFollwingUserAndCreatorUidState(true);
  //   }
  // }, []);

  // console.log('item: ', item);
  // console.log('data: ', data);

  //* mutation 사용해서 팔로잉 데이터 보내기
  const { mutate: follwingMutate } = useMutation(addFollowing, {
    onSuccess: () => {
      console.log('팔로잉 요청 성공');
    },
    onError: () => {
      console.log('팔로잉 요청 실패');
    },
  });

  //* 팔로잉버튼 눌렀을때 실행하는 함수
  const onClickFollowingBtn = (item: any) => {
    console.log('팔로잉 버튼을 클릭했습니다.');
    follwingMutate({ ...item, uid: authService?.currentUser?.uid });
    setFollwingUserAndCreatorUidState(!follwingUserAndCreatorUidState);
  };

  //* mutation 사용해서 팔로잉 삭제 데이터 보내기
  const { mutate: deleteFollowingMutate } = useMutation(deleteFollwing, {
    onSuccess: () => {
      console.log('팔로잉 삭제 요청 성공');
    },
    onError: () => {
      console.log('팔로잉 삭제 요청 실패');
    },
  });

  //* 팔로잉삭제 버튼 눌렀을때 실행하는 함수
  const onClickDeleteFollwing = (item: any) => {
    console.log('팔로잉삭제 버튼을 클릭했습니다');
    deleteFollowingMutate({ ...item, uid: authService?.currentUser?.uid });
    setFollwingUserAndCreatorUidState(!follwingUserAndCreatorUidState);
  };

  //* useQuery 사용해서 following 데이터 불러오기
  const {
    data: followingData,
    isLoading,
    isError,
  } = useQuery('followingData', getFollwing);

  if (isLoading) return <h1>로딩중 입니다</h1>;
  if (isError) return <h1>통신이 불안정합니다</h1>;

  //* 해당 게시물에 대하여 팔로우한 사람은 팔로우 삭제 버튼이 팔로우 하지 않은 사람은 팔로우 추가 버튼을 보이도록 하기
  //? 팔로잉한 사람 uid를 배열에 담았습니다.
  const followingUserUid = followingData
    .filter((item: any) => {
      return item.uid === authService.currentUser?.uid;
    })
    .find((item: any) => {
      return item.follow;
    })?.follow;
  // console.log('followingUserUid: ', followingUserUid);

  //? 팔로잉한 사람 uid와 작성자 uid가 같으면 변수에 해당 id가 담깁니다. 없을 경우에는 undefined가 담깁니다.
  const follwingUserAndCreatorUid = followingUserUid?.find((good: any) => {
    return good === item.creator;
  });
  console.log('follwingUserAndCreatorUid: ', follwingUserAndCreatorUid);
  // setFollwingUserAndCreatorUidState(follwingUserAndCreatorUid);

  //! 1번째 방법 : 초기 state에 반복문이 들어가면 렌더링 초과로 에러가 난다.
  // const [follwingUserAndCreatorUid, setFollwingUserAndCreatorUid] = useState(
  //   followingUserUid.find((good: any) => {
  //     return good === item.creator;
  //   })
  // );
  // setFollwingUserAndCreatorUidState(follwingUserAndCreatorUid);

  // console.log(authService.currentUser?.uid);

  return (
    <div>
      {follwingUserAndCreatorUidState ? (
        <StFollowingBtn onClick={() => onClickDeleteFollwing(item)}>
          팔로잉 삭제
        </StFollowingBtn>
      ) : (
        // 익명함수뒤에 함수 추가가 가능하다
        <StFollowingBtn onClick={() => onClickFollowingBtn(item)}>
          팔로잉
        </StFollowingBtn>
      )}
    </div>
  );
};

export default FollowingButton;

const StFollowingBtn = styled.button`
  color: red;
`;
