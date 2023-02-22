import Header from '@/components/Header';
import { getData, getFollwing, getUser } from '@/api';
import Profile from '@/components/mypage/Profile';
import Seo from '@/components/Seo';
import { authService } from '@/firebase';
import Image from 'next/image';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import CollectionList from '@/components/mypage/CollectionList';
import { uuidv4 } from '@firebase/util';

interface propsType {
  followingCount: number;
  followerCount: number;
}
type ProfileItemProps = {
  nickname: string;
  image: string;
  followingCount: number;
  followerCount: number;
};

export default function Mypage({ followingCount, followerCount }: propsType) {
  console.log(authService.currentUser?.displayName);
  console.log(authService.currentUser?.photoURL);

  //* useQuery 사용해서 데이터 불러오기
  const { data } = useQuery('data', getData);
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
    <>
      <Seo title="My" />
      <Header />
      <MyContainer>
        <MyProfileContainer>
          <Profile />
        </MyProfileContainer>
        <h3>팔로잉 중인사람</h3>
        {followingUser?.map((item: any) => (
          <div key={item.uid} style={{ display: 'flex', flexDirection: 'row' }}>
            <div>{item.userName}</div>
            <Image src={item.userImg} alt="image" height={100} width={100} />
          </div>
        ))}
        <MyKeywordContainer>키워드</MyKeywordContainer>
        {/* 구분하기 위해 임의로 라인 그었습니다! */}
        <CollectionListBox>
          <CollectionList key={uuidv4()} postData={data} />
        </CollectionListBox>
      </MyContainer>
    </>
  );
}

const MyContainer = styled.div`
  width: 100%;
  height: 55vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const MyProfileContainer = styled.div`
  width: 600px;
  height: 200px;
`;

const MyKeywordContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const CollectionListBox = styled.div`
  border: solid 1px tomato;
`;
