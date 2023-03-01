import Header from '@/components/Header';
import Seo from '@/components/Seo';
import Profile from '@/components/mypage/Profile/Profile';
import CollectionList from '@/components/mypage/CollectionList';
import { getData, getFollow, getFollowing, getUser } from '@/api';
import { authService } from '@/firebase';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import MyPostList from '@/components/mypage/MyPostList';
import { useState } from 'react';

export default function Mypage() {
  const [onSpot, setOnSpot] = useState(true);

  //* useQuery 사용해서 데이터 불러오기
  const { data: postData } = useQuery('data', getData);

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

  //* follow에서 docId와 현재 uid가 같은 follow만 뽑기
  const { data: followData } = useQuery('FollowData', getFollow, {
    select: (data) =>
      data?.filter(
        (item: any) => item.docId === authService.currentUser?.uid
      )[0]?.follow,
  });
  // console.log('followData: ', followData);
  const followCount = followData?.length; //* 나를 팔로잉 하는 사람 숫자

  if (isLoading) return <h1>로딩 중입니다.</h1>;
  if (isError) return <h1>연결이 원활하지 않습니다.</h1>;

  return (
    <>
      <Seo title="My" />
      <Header selectCity={undefined} onChangeSelectCity={undefined} />
      <MyContainer>
        <MyProfileContainer>
          <Profile followingCount={followingCount} followCount={followCount} />
        </MyProfileContainer>
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

        <GridBox>{onSpot ? <MyPostList /> : <CollectionList />}</GridBox>
      </AllMyPostList>
    </>
  );
}

const MyContainer = styled.div`
  width: 100%;
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
