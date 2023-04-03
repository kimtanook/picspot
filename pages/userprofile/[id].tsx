import {
  addFollow2,
  addFollowing2,
  deleteFollow2,
  deleteFollowing2,
  getFollow,
  getFollowing,
  getSpecificUser,
  getUser,
} from '@/api';
import { messageSendToggle } from '@/atom';
import Header from '@/components/Header';
import Seo from '@/components/Seo';
import UserCollectionList from '@/components/userprofile/UserCollectionList';
import UserPostList from '@/components/userprofile/UserPostList';
import { authService } from '@/firebase';
import { logEvent } from '@/utils/amplitude';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useMediaQuery } from 'react-responsive';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

function Profile() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const userId = router.query.id as string;
  const [onSpot, setOnSpot] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isPc, setIsPc] = useState(false);
  const mobile = useMediaQuery({ maxWidth: 785 });
  const pc = useMediaQuery({ minWidth: 786 });

  const { data: specificUserData } = useQuery(
    ['backgroundData', userId],
    getSpecificUser
  );
  const backgroundUrl = specificUserData?.background;

  const { data: getUserData } = useQuery('getUserProfileData', getUser);
  //* 현재 페이지 유저가 팔로잉한 사람 uid가 담긴 배열
  const { data: getFollowingData } = useQuery(
    'getFollowingData',
    getFollowing,
    {
      select: (data) =>
        data?.filter(
          (item: { [key: string]: string }) => item.docId === userId
        )[0]?.following,
    }
  );
  //* 현재 페이지 유저를 팔로우한 사람 uid가 담긴 배열
  const { data: getFollowData } = useQuery('getFollowData', getFollow, {
    select: (data) =>
      data?.filter(
        (item: { [key: string]: string }) => item.docId === userId
      )[0]?.follow,
  });

  const [sendMsgToggle, setSendMsgToggle] = useRecoilState(messageSendToggle);

  //* 다른 사용자의 프로필을 보여주기 위한 filter
  const userData = getUserData?.filter(
    (item: { [key: string]: string }) => item.uid === userId
  )[0];

  //* 내가 팔로잉한 사람 uid가 담긴 배열
  const { data: getMyFollowing } = useQuery('getMyFollowing', getFollowing, {
    select: (data) =>
      data?.filter(
        (item: { [key: string]: string }) =>
          item.docId === authService.currentUser?.uid
      )[0]?.following,
  });

  //* mutation 사용해서 팔로잉, 팔로워 추가 데이터 보내기
  const { mutate: followingMutate } = useMutation(addFollowing2, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries('getFollowData'), 500);
      setTimeout(() => queryClient.invalidateQueries('getMyFollowing'), 500);
    },
    onError: () => {},
  });
  const { mutate: followMutate } = useMutation(addFollow2, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries('getFollowData'), 500);
      setTimeout(() => queryClient.invalidateQueries('getMyFollowing'), 500);
    },
    onError: () => {},
  });

  //* 팔로잉 버튼을 눌렀을때 실행하는 함수
  const onClickFollowingBtn = (item: any) => {
    followingMutate({ ...item, id: authService?.currentUser?.uid });
    followMutate({ ...item, id: authService?.currentUser?.uid });
    logEvent('팔로잉 버튼', { from: 'userprofile page' });
  };

  //* mutation 사용해서 팔로잉, 팔로워 추가 데이터 보내기
  const { mutate: deleteFollowingMutate } = useMutation(deleteFollowing2, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries('getFollowData'), 500);
      setTimeout(() => queryClient.invalidateQueries('getMyFollowing'), 500);
    },
    onError: () => {},
  });
  const { mutate: deleteFollowMutate } = useMutation(deleteFollow2, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries('getFollowData'), 500);
      setTimeout(() => queryClient.invalidateQueries('getMyFollowing'), 500);
    },
    onError: () => {},
  });

  //* 언팔로잉 버튼을 눌렀을때 실행하는 함수
  const onClickDeleteFollowingBtn = (item: any) => {
    deleteFollowingMutate({ ...item, id: authService?.currentUser?.uid });
    deleteFollowMutate({ ...item, id: authService?.currentUser?.uid });
    logEvent('언팔로잉 버튼', { from: 'userprofile page' });
  };

  // 반응형 모바일 작업 시, 모달 지도 사이즈 줄이기
  useEffect(() => {
    setIsMobile(mobile);
    setIsPc(pc);
  }, [mobile, pc]);

  //* Amplitude 이벤트 생성
  useEffect(() => {
    logEvent('유저 프로필 페이지', { from: 'userprofile page' });
  }, []);

  return (
    <Wrap backgroundUrl={backgroundUrl}>
      <Seo title="My" />
      {isPc && (
        <Header
          selectCity={undefined}
          onChangeSelectCity={undefined}
          searchOptionRef={undefined}
          searchValue={undefined}
          onChangeSearchValue={undefined}
        />
      )}

      <UserContainer>
        <>
          {isMobile && (
            <Link href="/main?city=제주전체">
              <Back
                onClick={() => {
                  localStorage.clear();
                }}
              >
                <MobileBack src="/Back-point.png" alt="image" />
              </Back>
            </Link>
          )}
        </>
        {isMobile && <HeaderText>유저페이지</HeaderText>}
        <UserProfileContainer>
          <ProfileContainer>
            <ProfileImage img={userData?.userImg}></ProfileImage>
            <ProfileText>
              <ProfileTextWrap>
                <ProfileNickname>{userData?.userName}님</ProfileNickname>

                {authService.currentUser ? (
                  getMyFollowing?.indexOf(userId) === undefined ||
                  getMyFollowing?.indexOf(userId) === -1 ? (
                    <FollowingBtn onClick={() => onClickFollowingBtn(userData)}>
                      <FollowingCheckAirplane
                        src="/following-checked.png"
                        alt="image"
                      />
                      팔로잉
                    </FollowingBtn>
                  ) : (
                    <FollowingBtn
                      onClick={() => onClickDeleteFollowingBtn(userData)}
                    >
                      언팔로잉
                    </FollowingBtn>
                  )
                ) : null}

                {authService.currentUser ? (
                  <SendMsg onClick={() => setSendMsgToggle(true)}>
                    <FollowingCheckAirplane
                      src="/airplane-white.png"
                      alt="image"
                    />{' '}
                    쪽지보내기
                  </SendMsg>
                ) : null}
              </ProfileTextWrap>

              <Follow>
                <FollowerCount>
                  {getFollowData?.length === undefined
                    ? '0'
                    : getFollowData?.length}{' '}
                  팔로워
                </FollowerCount>
                <FollowBtween>|</FollowBtween>
                <FollowerCount>
                  {getFollowingData?.length === undefined
                    ? '0'
                    : getFollowingData?.length}{' '}
                  팔로잉
                  <FollowingOpenModal src="/open-arrow.png" alt="image" />
                </FollowerCount>
              </Follow>
              <>
                {isMobile && (
                  <ProfileTextWrap>
                    {getMyFollowing?.indexOf(userId) === -1 ? (
                      <FollowingBotton
                        onClick={() => onClickFollowingBtn(userData)}
                      >
                        <FollowingCheckAirplane
                          src="/following-checked.png"
                          alt="image"
                        />
                        팔로잉
                      </FollowingBotton>
                    ) : (
                      <FollowingBotton
                        onClick={() => onClickDeleteFollowingBtn(userData)}
                      >
                        언팔로잉
                      </FollowingBotton>
                    )}
                    <SendMessage onClick={() => setSendMsgToggle(true)}>
                      <FollowingCheckAirplane
                        src="/airplane-white.png"
                        alt="image"
                      />{' '}
                      쪽지보내기
                    </SendMessage>
                  </ProfileTextWrap>
                )}
              </>
            </ProfileText>
          </ProfileContainer>
        </UserProfileContainer>
      </UserContainer>
      {/* 내 게시물과 저장한 게시물입니다 */}
      <UserPostTownList>
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
        <GridBox>
          {onSpot ? (
            <UserPostList userId={userId} />
          ) : (
            <UserCollectionList userId={userId} />
          )}
        </GridBox>
      </UserPostTownList>
    </Wrap>
  );
}
export default Profile;
const Wrap = styled.div<{ backgroundUrl: string }>`
  background-image: ${(props) => `url(${props.backgroundUrl})`};
`;
const UserContainer = styled.div`
  box-shadow: inset 0px 20px 15px rgba(0, 0, 0, 0.05);
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top: 64px;
  margin-bottom: 10px;
  background-color: #fbfbfb;
  @media ${(props) => props.theme.mobile} {
    background-color: white;
  }
`;
const Back = styled.div`
  position: absolute;
  transform: translate(-1350%, -150%);
`;
const MobileBack = styled.img`
  width: 12px;
  height: 22px;
`;
const HeaderText = styled.div`
  font-size: 20px;
  font-weight: bold;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(10%, -420%);
`;
const UserProfileContainer = styled.div`
  width: 600px;
  height: 200px;
  @media ${(props) => props.theme.mobile} {
    width: 100vw;
    height: 150px;
  }
`;

const UserPostTownList = styled.div`
  margin: auto;
  width: 1188px;
  @media ${(props) => props.theme.mobile} {
    width: 100vw;
  }
`;
const CategoryBtn = styled.div`
  text-align: center;
  @media ${(props) => props.theme.mobile} {
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

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 4vw;
  @media ${(props) => props.theme.mobile} {
    width: 90vw;
    display: inline-flex;
    margin-left: 45px;
  }
`;

const ProfileImage = styled.div<{ img: string }>`
  width: 120px;
  height: 120px;
  border-radius: 100px;
  background-size: cover;
  background-image: url(${(props) => props.img});
  background-position: center center;
  @media ${(props) => props.theme.mobile} {
    width: 112px;
    height: 112px;
  }
`;

const ProfileText = styled.div`
  padding-left: 35px;
  width: 100%;
  @media ${(props) => props.theme.mobile} {
    padding-left: 25px;
  }
`;
const ProfileTextWrap = styled.div`
  display: flex;
  align-items: center;
  text-align: center;

  margin-top: 5px;
`;
const ProfileNickname = styled.div`
  color: #212121;
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  text-align: left;
  @media ${(props) => props.theme.mobile} {
    font-size: 18px;
  }
`;

const FollowingBtn = styled.div`
  background-color: #4cb2f6;
  color: white;
  width: 80px;
  height: 32px;
  padding-top: 7px;
  padding-bottom: 10px;
  border-radius: 30px;
  margin-right: 12px;
  margin-left: 12px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  :hover {
    background-color: #32aaff;
    color: white;
    transition: 0.5s;
  }
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
`;
const FollowingBotton = styled.div`
  background-color: #4cb2f6;
  color: white;
  width: 71px;
  height: 28px;
  padding-top: 7px;
  padding-bottom: 10px;
  border-radius: 30px;
  margin-right: 12px;
  font-weight: bold;
  font-size: 12px;
  margin-top: 10px;
  cursor: pointer;
  :hover {
    background-color: #32aaff;
    color: white;
    transition: 0.5s;
  }
`;
const SendMsg = styled.button`
  color: white;
  background-color: gray;
  font-size: 14px;
  width: 109px;
  height: 32px;
  border: 0px;
  border-radius: 22px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.5s;
  :hover {
    background-color: darkgray;
    color: white;
    transition: 0.5s;
  }
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
`;
const SendMessage = styled.button`
  background-color: #5b5b5f;
  color: white;
  font-size: 12px;
  width: 97px;
  height: 28px;
  border: 1px solid #5b5b5f;
  border-radius: 22px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  cursor: pointer;
  transition: 0.5s;
  :hover {
    background-color: black;
    color: white;
    transition: 0.5s;
  }
`;
const Follow = styled.div`
  font-size: 16px;
  color: #5b5b5f;
  display: flex;
  text-align: left;
  align-items: center;
  gap: 16px;

  @media ${(props) => props.theme.mobile} {
    font-size: 14px;
  }
`;
const FollowerCount = styled.div`
  font-size: 16px;
  color: #5b5b5f;
  padding-top: 10px;
  @media ${(props) => props.theme.mobile} {
    font-size: 14px;
  }
`;
const FollowBtween = styled.div`
  font-size: 25px;
  color: #d9d9d9;
  padding-top: 10px;
  @media ${(props) => props.theme.mobile} {
    font-size: 14px;
  }
`;
const FollowingCheckAirplane = styled.img`
  background-color: transparent;
  margin-right: 5px;
  width: 17px;
  height: 16px;
  cursor: pointer;
`;

const FollowingOpenModal = styled.img`
  background-color: transparent;
  margin-left: 5px;
  width: 12px;
  height: 12px;
  cursor: pointer;
`;
