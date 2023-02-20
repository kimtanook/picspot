import { getFollwing, getUser } from '@/api';
import Profile from '@/components/mypage/Profile';
import Seo from '@/components/Seo';
import { authService } from '@/firebase';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from 'react-query';
import styled from 'styled-components';

export default function Mypage() {
  console.log(authService.currentUser?.displayName);
  console.log(authService.currentUser?.photoURL);

  //* useQuery 사용해서 following 데이터 불러오기
  const {
    data: followingData,
    isLoading,
    isError,
  } = useQuery('followingData', getFollwing);
  // console.log('followingData: ', followingData);

  //* useQuery 사용해서 userData 데이터 불러오기
  const { data: userData } = useQuery('userData', getUser);
  // console.log('userData: ', userData);

  //* 팔로잉한 사람 프로필 닉네임 뽑아오기
  //? 팔로잉한 사람 uid를 배열에 담았습니다.
  const authFollowingUid = followingData
    ?.filter((item: any) => {
      return item.uid === authService?.currentUser?.uid;
    })
    ?.find((item: any) => {
      return item.follow;
    })?.follow;
  // console.log('authFollowingUid: ', authFollowingUid);

  //? user의 item.uid과 팔로잉한 사람 uid의 교집합을 배열에 담았습니다.
  const followingUser = userData?.filter((item: any) =>
    authFollowingUid?.includes(item.uid)
  );
  // console.log('followingUser: ', followingUser);

  if (isLoading) return <h1>로딩 중입니다.</h1>;
  if (isError) return <h1>연결이 원활하지 않습니다.</h1>;

  return (
    <MyContainer>
      <MyTextDiv>
        <Seo title="My" />
        <h1>마이페이지입니다</h1>
        <Link href={'/'}>
          <ToMainpage>메인페이지로 돌아가기</ToMainpage>
        </Link>
      </MyTextDiv>
      <MyProfileContainer>
        <Profile />
      </MyProfileContainer>
      <h3>팔로잉 중인사람</h3>
      {followingUser?.map((item: any) => (
        <div key={item.uid} style={{ display: 'flex', flexDirection: 'row' }}>
          <div>{item.userName}</div>
          <Image
            src={item.userImg === null ? '/plusimage.png' : item.userImg}
            alt="image"
            height={100}
            width={100}
          />
        </div>
      ))}

      <MyKeywordContainer>키워드</MyKeywordContainer>
    </MyContainer>
  );
}
const MyContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const MyTextDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ToMainpage = styled.button``;

const MyProfileContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const MyKeywordContainer = styled.div`
  display: flex;
  justify-content: center;
`;
