import Header from '@/components/Header';
import Seo from '@/components/Seo';
import Profile from '@/components/mypage/Profile/Profile';
import CollectionList from '@/components/mypage/CollectionList';
import { getFollow, getFollowing } from '@/api';
import { authService } from '@/firebase';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import MyPostList from '@/components/mypage/MyPostList';
import { useState } from 'react';
import DataLoading from '@/components/common/DataLoading';
import DataError from '@/components/common/DataError';
import { useMediaQuery } from 'react-responsive';

export default function Mypage() {
  const [onSpot, setOnSpot] = useState(true);

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
  const followingCount = followingData?.length; //* 내가 팔로잉 하는 사람 숫자

  //* follow에서 docId와 현재 uid가 같은 follow만 뽑기
  const { data: followData } = useQuery('FollowData', getFollow, {
    select: (data) =>
      data?.filter(
        (item: any) => item.docId === authService.currentUser?.uid
      )[0]?.follow,
  });

  const followCount = followData?.length; //* 나를 팔로잉 하는 사람 숫자

  if (isLoading) return <DataLoading />;
  if (isError) return <DataError />;

  return (
    <>
      <Seo title="My" />
      <Header selectCity={undefined} onChangeSelectCity={undefined} />
      <MyContainer>
        <MyProfileContainer>
          <Profile followingCount={followingCount} followCount={followCount} />
        </MyProfileContainer>
      </MyContainer>
      {/* 내 게시물과 저장한 게시물입니다  */}
      <AllMyPostList>
        <CategoryBtn>
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
        </CategoryBtn>

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
  @media ${(props) => props.theme.mobile} {
    width: 100vw;
  }
`;

const CategoryBtn = styled.div`
  margin: 40px 0px 10px 0px;
  text-align: center;
  @media ${(props) => props.theme.mobile} {
    /* text-align: left; */
    margin: 0px;
    width: 100%;
  }
`;

const GridBox = styled.div`
  width: 1188px;
  margin-top: 19px;
  display: inline-flex;
  justify-content: space-between;
  @media ${(props) => props.theme.mobile} {
    width: 100vw;
  }
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
    border-bottom: 3.5px solid #1882ff;
    color: #1882ff;
    transition: all 0.3s;
  }
  @media ${(props) => props.theme.mobile} {
    color: #d9d9d9;
    font-size: 12px;
    width: 50vw;
    margin-right: 0px;
    border-bottom: 0.5px solid #d9d9d9;
    padding: 0px;
  }
`;
const BlackBtn = styled.button`
  font-size: 20px;
  font-weight: 700;
  border: none;
  background-color: white;
  color: #1882ff;
  border-bottom: 3.5px solid #1882ff;
  padding-bottom: 5px;
  margin-right: 20px;
  line-height: 30px;
  letter-spacing: -0.015em;
  @media ${(props) => props.theme.mobile} {
    font-size: 12px;
    width: 50vw;
    margin-right: 0px;
    border-bottom: 0.5px solid #1882ff;
    padding: 0px;
  }
`;
