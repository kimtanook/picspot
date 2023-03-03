import {
  addFollow,
  addFollowing,
  deleteFollow,
  deleteFollowing,
  getFollow,
  getFollowing,
  getUser,
} from '@/api';
import Header from '@/components/Header';
import Seo from '@/components/Seo';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import UserPostList from '@/components/userprofile/UserPostList';
import UserCollectionList from '@/components/userprofile/UserCollectionList';
import { useRecoilState } from 'recoil';
import { messageSendToggle } from '@/atom';
import { authService } from '@/firebase';

function Profile() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const userId = router.query.id as string;

  const [onSpot, setOnSpot] = useState(true);

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
  // console.log('getMyFollowing: ', getMyFollowing);

  //* mutation 사용해서 팔로잉, 팔로워 추가 데이터 보내기
  const { mutate: followingMutate } = useMutation(addFollowing);
  const { mutate: followMutate } = useMutation(addFollow, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries('getFollowData'), 500);
      setTimeout(() => queryClient.invalidateQueries('getMyFollowing'), 500);
    },
    onError: () => {},
  });

  //* 팔로잉 버튼을 눌렀을때 실행하는 함수
  const onClickFollowingBtn = (item: any) => {
    // console.log('item: ', item);
    followingMutate({ ...item, uid: authService?.currentUser?.uid });
    followMutate({ ...item, uid: authService?.currentUser?.uid });
  };

  //* mutation 사용해서 팔로잉, 팔로워 추가 데이터 보내기
  const { mutate: deleteFollowingMutate } = useMutation(deleteFollowing);
  const { mutate: deleteFollowMutate } = useMutation(deleteFollow, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries('getFollowData'), 500);
      setTimeout(() => queryClient.invalidateQueries('getMyFollowing'), 500);
    },
    onError: () => {},
  });

  //* 언팔로잉 버튼을 눌렀을때 실행하는 함수
  const onClickDeleteFollowingBtn = (item: any) => {
    // console.log('item: ', item);
    deleteFollowingMutate({ ...item, uid: authService?.currentUser?.uid });
    deleteFollowMutate({ ...item, uid: authService?.currentUser?.uid });
  };

  return (
    <>
      <Seo title="My" />
      <Header selectCity={undefined} onChangeSelectCity={undefined} />
      <UserContainer>
        <UserProfileContainer>
          <ProfileContainer>
            <ProfileImage img={userData?.userImg}></ProfileImage>
            <ProfileText>
              <ProfileTextWrap>
                <ProfileNickname>{userData?.userName}님</ProfileNickname>
                {getMyFollowing?.indexOf(userId) === -1 ? (
                  <FollowingBtn onClick={() => onClickFollowingBtn(userData)}>
                    팔로잉
                  </FollowingBtn>
                ) : (
                  <FollowingBtn
                    onClick={() => onClickDeleteFollowingBtn(userData)}
                  >
                    언팔로잉
                  </FollowingBtn>
                )}
                <SendMessage onClick={() => setSendMsgToggle(true)}>
                  쪽지보내기
                </SendMessage>
              </ProfileTextWrap>
              <FollowWrap>
                <MyProfileFollowing>
                  팔로잉
                  <FollowCount>
                    {null ? '0' : getFollowingData?.length}
                  </FollowCount>
                </MyProfileFollowing>
                <MyProfileFollower>
                  팔로워
                  <FollowCount>
                    {null ? '0' : getFollowData?.length}
                  </FollowCount>
                </MyProfileFollower>
              </FollowWrap>
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
    </>
  );
}

const UserContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 64px;
`;

const UserProfileContainer = styled.div`
  width: 600px;
  height: 200px;
`;

const UserPostTownList = styled.div`
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

export default Profile;

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileImage = styled.div<{ img: string }>`
  width: 150px;
  height: 150px;
  border-radius: 100px;
  background-size: cover;
  background-image: url(${(props) => props.img});
  background-position: center center;
`;

const ProfileText = styled.div`
  padding-left: 15px;
  width: 60%;
`;
const ProfileTextWrap = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
`;
const ProfileNickname = styled.div`
  width: 150px;
  line-height: 36px;
  height: 36px;
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  text-align: center;
`;

const FollowingBtn = styled.div`
  background-color: #4cb2f6;
  color: white;
  cursor: pointer;
  width: 80px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 30px;
  margin-right: 20px;
`;

const SendMessage = styled.button`
  background-color: white;
  border: 1px black solid;
  border-radius: 16px;
  cursor: pointer;
  transition: 0.5s;
  :hover {
    background-color: black;
    color: white;
    transition: 0.5s;
  }
`;

const FollowWrap = styled.div`
  display: grid;
  grid-template-columns: 35% 35%;
  margin-top: 10px;
  margin-left: 27px;
`;
const FollowCount = styled.div`
  margin-top: 10px;
`;
const MyProfileFollowing = styled.div`
  color: 5B5B5F;
  border-radius: 20px;
  background-color: #f8f8f8;
  padding: 7%;
  font-size: 18pt;
  width: 90px;
  height: 85px;
  text-align: center;
`;
const MyProfileFollower = styled.div`
  color: 5B5B5F;
  border-radius: 20px;
  background-color: #f8f8f8;
  padding: 7%;
  font-size: 18pt;
  width: 90px;
  height: 85px;
  text-align: center;
`;
