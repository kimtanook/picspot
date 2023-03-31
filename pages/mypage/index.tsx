import { getFollow, getFollowing, getSpecificUser } from '@/api';
import { CustomBackgroundModal } from '@/atom';
import DataError from '@/components/common/DataError';
import DataLoading from '@/components/common/DataLoading';
import Header from '@/components/Header';
import CollectionList from '@/components/mypage/CollectionList';
import MyPostList from '@/components/mypage/MyPostList';
import Profile from '@/components/mypage/Profile/Profile';
import Seo from '@/components/Seo';
import { authService } from '@/firebase';
import { logEvent } from '@/utils/amplitude';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useMediaQuery } from 'react-responsive';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

export default function Mypage() {
  const [onSpot, setOnSpot] = useState(true);
  const isMobile = useMediaQuery({ maxWidth: 823 });
  const [backgroundModal, setBackgroundModal] = useRecoilState(
    CustomBackgroundModal
  );
  const userUid = authService.currentUser?.uid;
  const { data: specificUserData } = useQuery(
    ['backgroundData', userUid],
    getSpecificUser
  );

  const backgroundUrl = specificUserData?.background;

  //* following에서 uid와 현재 uid가 같은 following만 뽑기
  const {
    data: followingData,
    isLoading,
    isError,
  } = useQuery('FollowingData', getFollowing, {
    select: (data) =>
      data?.find(
        (item: { docId: string | undefined }) =>
          item.docId === authService.currentUser?.uid
      )?.following,
  });
  const followingCount = followingData?.length; //* 내가 팔로잉 하는 사람 숫자

  //* follow에서 docId와 현재 uid가 같은 follow만 뽑기
  const { data: followData } = useQuery('FollowData', getFollow, {
    select: (data) =>
      data?.filter(
        (item: { docId: string | undefined }) =>
          item.docId === authService.currentUser?.uid
      )[0]?.follow,
  });

  const followerCount = followData?.length; //* 나를 팔로잉 하는 사람 숫자

  //* Amplitude 이벤트 생성
  useEffect(() => {
    logEvent('마이 페이지', { from: 'my page' });
  }, []);

  if (isLoading) return <DataLoading />;
  if (isError) return <DataError />;

  return (
    <Wrap backgroundUrl={backgroundUrl}>
      <Seo title="My" />
      {isMobile ? (
        ''
      ) : (
        <>
          <Header
            selectCity={undefined}
            onChangeSelectCity={undefined}
            searchOptionRef={undefined}
            searchValue={undefined}
            onChangeSearchValue={undefined}
          />
        </>
      )}
      <BackgroundModalButton>
        <Image
          onClick={() => setBackgroundModal(!backgroundModal)}
          src="/mypage/custom-button.png"
          width={36}
          height={36}
          alt="custom-button"
        />
      </BackgroundModalButton>
      <MyContainer>
        <MyProfileContainer>
          <Profile
            followingCount={followingCount}
            followerCount={followerCount}
          />
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
    </Wrap>
  );
}
const Wrap = styled.div<{ backgroundUrl: string }>`
  background-image: ${(props) => `url(${props.backgroundUrl})`};
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
`;

const BackgroundModalButton = styled.div`
  position: absolute;
  top: 20%;
  left: 78%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
`;
const MyContainer = styled.div`
  box-shadow: inset 0px 20px 15px rgba(0, 0, 0, 0.05);
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top: 64px;
  overflow: hidden;
  margin-bottom: 10px;
  background-color: #fbfbfb;
  @media ${(props) => props.theme.mobile} {
    background-color: white;
  }
`;
const MyProfileContainer = styled.div`
  width: 600px;
  height: 200px;

  @media ${(props) => props.theme.mobile} {
    width: 100vw;
    height: 40vw;
  }
`;

const AllMyPostList = styled.div`
  margin: auto;
  width: 1188px;
  @media ${(props) => props.theme.mobile} {
    width: 100vw;
  }
`;

const CategoryBtn = styled.div`
  text-align: center;
  @media ${(props) => props.theme.mobile} {
    /* text-align: left; */
    margin: 0px;
    width: 100%;
  }
`;

const GridBox = styled.div`
  width: 1188px;
  margin-top: 44px;
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
  background-color: inherit;
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
  background-color: inherit;
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
