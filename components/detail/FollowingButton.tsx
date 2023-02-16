import { addFollowing, deleteFollwing, getFollwing } from '@/api';
import { authService } from '@/firebase';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const FollowingButton = ({ item }: any) => {
  const router = useRouter();
  const { id } = router.query;

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
  };

  //* useQuery 사용해서 following 데이터 불러오기
  const { data, isLoading, isError } = useQuery('followingData', getFollwing);

  //* following 걸러내기
  // console.log('item: ', item);
  console.log('data: ', data);
  console.log('authService.currentUser.uid', authService?.currentUser?.uid);

  if (isLoading) return <h1>로딩중 입니다</h1>;
  if (isError) return <h1>통신이 불안정합니다</h1>;

  return (
    <div>
      {/* 해당 게시물에 대하여 팔로우한 사람은 팔로우 삭제 버튼이 팔로우 하지 않은 사람은 팔로우 추가 버튼을 보이도록 하기!! */}
      {/* {data
        .map((following: any) => {
          console.log('following.id: ', following.id);
          console.log('following.follow: ', following.follow);
          return following.follow === id;
          //following.id === authService?.currentUser?.uid;
        })
        .map((follow: any) => (
          <div key={uuidv4()}>
            {follow === id ? (
              <StFollowingBtn onClick={() => onClickFollowingBtn(item)}>
                팔로잉
              </StFollowingBtn>
            ) : (
              <StFollowingBtn onClick={() => onClickDeleteFollwing(item)}>
                팔로잉 삭제
              </StFollowingBtn>
            )}
          </div>
        ))} */}

      <StFollowingBtn onClick={() => onClickFollowingBtn(item)}>
        팔로잉
      </StFollowingBtn>
      <StFollowingBtn onClick={() => onClickDeleteFollwing(item)}>
        팔로잉 삭제
      </StFollowingBtn>
    </div>
  );
};

export default FollowingButton;

const StFollowingBtn = styled.button`
  color: red;
`;
