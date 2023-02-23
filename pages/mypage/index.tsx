import Header from '@/components/Header';
import Seo from '@/components/Seo';
import Profile from '@/components/mypage/Profile/Profile';
import CollectionList from '@/components/mypage/CollectionList';
import { getData, getFollwing, getUser } from '@/api';
import { authService } from '@/firebase';
import Image from 'next/image';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import MyPostList from '@/components/mypage/MyPostList';
import { useState } from 'react';
import Masonry from 'react-responsive-masonry';
import Link from 'next/link';

export default function Mypage() {
  const [currentUser, setCurrentUser] = useState(false);
  const [onSpot, setOnSpot] = useState(true);
  const [more, setMore]: any = useState(true);

  //* useQuery 사용해서 데이터 불러오기
  const { data } = useQuery('data', getData);
  //* useQuery 사용해서 following 데이터 불러오기
  const {
    data: followingData,
    isLoading,
    isError,
  } = useQuery('followingData', getFollwing);

  //* useQuery 사용해서 userData 데이터 불러오기
  const { data: userData } = useQuery('userData', getUser);

  //* 팔로잉한 사람 프로필 닉네임 뽑아오기
  //? 팔로잉한 사람 uid를 배열에 담았습니다.
  const authFollowingUid = followingData
    ?.filter((item: any) => {
      return item.uid === authService?.currentUser?.uid;
    })
    ?.find((item: any) => {
      return item.follow;
    })?.follow;

  //? user의 item.uid과 팔로잉한 사람 uid의 교집합을 배열에 담았습니다.
  const followingUser = userData?.filter((item: any) =>
    authFollowingUid?.includes(item.uid)
  );

  // 팔로잉 하는 사람 숫자
  const followingCount = authFollowingUid?.length;

  if (isLoading) return <h1>로딩 중입니다.</h1>;
  if (isError) return <h1>연결이 원활하지 않습니다.</h1>;

  return (
    <>
      <Seo title="My" />
      <Header selectCity={undefined} onChangeSelectCity={undefined} />
      <MyContainer>
        <MyProfileContainer>
          <Profile followingCount={followingCount} />
        </MyProfileContainer>
        {/* {followingUser?.map((item: any) => (
          <div key={item.uid} style={{ display: 'flex', flexDirection: 'row' }}>
            <Link href={`/userprofile/${item.uid}`}>
              <div>{item.userName}</div>
              <Image src={item.userImg} alt="image" height={100} width={100} />
            </Link>
          </div>
        ))} */}
      </MyContainer>
      {/* 내 게시물과 저장한 게시물입니다 */}
      <AllMyPostList>
        <div style={{ margin: '40px 0px 10px 0px' }}>
          {onSpot ? (
            <>
              <BlackBtn onClick={() => setOnSpot(true)}>게시한 스팟</BlackBtn>
              <GrayBtn onClick={() => setOnSpot(false)}>저장한 스팟</GrayBtn>
            </>
          ) : (
            <>
              <GrayBtn onClick={() => setOnSpot(true)}>게시한 스팟</GrayBtn>
              <BlackBtn onClick={() => setOnSpot(false)}>저장한 스팟</BlackBtn>
            </>
          )}
        </div>

        <GridBox>
          {onSpot ? (
            <MyPostList more={more} setMore={setMore} />
          ) : (
            <CollectionList postData={data} />
          )}
        </GridBox>
      </AllMyPostList>
    </>
  );
}

const MyContainer = styled.div`
  width: 100%;
  /* height: 55vh; */
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 64px;
`;
const MyProfileContainer = styled.div`
  width: 600px;
  height: 200px;
`;

const AllMyPostList = styled.div`
  margin: auto;
  width: 1188px;
`;

const GridBox = styled.div`
  width: 1188px;
  margin-top: 19px;
  display: inline-flex;

  justify-content: space-between;
`;

const GrayBtn = styled.button`
  font-size: 20px;
  font-weight: 700;
  border: none;
  background-color: white;
  color: #8e8e93;
  border-bottom: 3px solid #8e8e93;
  padding-bottom: 5px;
  margin-right: 20px;
  line-height: 30px;
  letter-spacing: -0.015em;
  :hover {
    border-bottom: 3.5px solid #212121;
    color: #212121;
    transition: all 0.3s;
  }
`;
const BlackBtn = styled.button`
  font-size: 20px;
  font-weight: 700;
  border: none;
  background-color: white;
  color: #212121;
  border-bottom: 3.5px solid #212121;
  padding-bottom: 5px;
  margin-right: 20px;
  line-height: 30px;
  letter-spacing: -0.015em;
`;
