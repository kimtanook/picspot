import { getFollowing, getUser } from '@/api';
import Header from '@/components/Header';
import Seo from '@/components/Seo';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import UserPostList from '@/components/userprofile/UserPostList';
import UserCollectionList from '@/components/userprofile/UserCollectionList';
import { useRecoilState } from 'recoil';
import { messageSendToggle } from '@/atom';
import DataLoading from '@/components/common/DataLoading';
import DataError from '@/components/common/DataError';

function Profile() {
  const router = useRouter();
  const userId = router.query.id as string;

  const [onSpot, setOnSpot] = useState(true);

  const { data: getUserData } = useQuery('getUserProfileData', getUser);
  const {
    data: getFollowingData,
    isLoading,
    isError,
  } = useQuery('getFollowingData', getFollowing);

  const [sendMsgToggle, setSendMsgToggle] = useRecoilState(messageSendToggle);

  // 다른 사용자의 프로필을 보여주기 위한 filter
  const userData = getUserData?.filter(
    (item: { [key: string]: string }) => item.uid === userId
  )[0];

  // 다른 사용자의 팔로잉을 보여주기 위한 filter
  const FollowingData = getFollowingData?.filter(
    (item: { [key: string]: string }) => item.uid === userId
  );

  if (isLoading) return <DataLoading />;
  if (isError) return <DataError />;
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
                <SendMessage onClick={() => setSendMsgToggle(true)}>
                  쪽지보내기
                </SendMessage>
              </ProfileTextWrap>
              <FollowWrap>
                <MyProfileFollowing>
                  팔로잉<FollowCount>{FollowingData?.length}</FollowCount>
                </MyProfileFollowing>
                <MyProfileFollower>
                  팔로워<FollowCount>{`(준비중)`}</FollowCount>
                </MyProfileFollower>
              </FollowWrap>
            </ProfileText>
          </ProfileContainer>
        </UserProfileContainer>
      </UserContainer>
      {/* 내 게시물과 저장한 게시물입니다 */}
      <UserPostTownList>
        <div style={{ margin: '40px 0px 10px 0px', textAlign: 'center' }}>
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
  margin-top: 40px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const UserProfileContainer = styled.div`
  width: 600px;
  height: 200px;
`;

const UserPostTownList = styled.div`
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
