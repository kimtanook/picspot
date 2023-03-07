import { getUser } from '@/api';
import { authService } from '@/firebase';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import styled from 'styled-components';

const DetailProfile = ({ item }: any) => {
  //* 마이페이지로 이동하기
  const router = useRouter();
  const onClickRouteMypage = (obj: any) => {
    if (authService.currentUser?.uid === obj.uid) {
      router.push(`/mypage`);
    } else {
      router.push({
        pathname: `/userprofile/${obj.uid}`,
        query: { name: obj.userName, userImg: obj.userImg },
      });
    }
  };

  //* useQuery 사용해서 유저 데이터 불러오기
  const { data: user } = useQuery('data', getUser);

  return (
    <>
      {user
        ?.filter((obj: any) => obj.uid === item.creator)
        .map((obj: any) => (
          <ProfileContainer
            key={obj.uid}
            onClick={() => onClickRouteMypage(obj)}
          >
            {authService.currentUser?.uid === obj.uid ? (
              <>
                {/* <ProfileImg src={obj.userImg} alt="image" /> */}
                <ProfileImgBox>
                  <Image
                    src={obj.userImg}
                    alt="userImage"
                    layout="fill"
                    priority={true}
                  />
                </ProfileImgBox>
                <ProfileName>{obj.userName}</ProfileName>
              </>
            ) : (
              <>
                <ProfileImg src={obj.userImg} alt="image" />
                <ProfileName>{obj.userName}</ProfileName>
              </>
            )}
          </ProfileContainer>
        ))}
    </>
  );
};

export default DetailProfile;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 10px;
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    height: 50px;
  }
`;

const ProfileImgBox = styled.div`
  position: relative;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin-right: 10px;
  @media ${(props) => props.theme.mobile} {
    width: 30px;
    height: 30px;
  }
`;

const ProfileImg = styled.img`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin-right: 10px;
  @media ${(props) => props.theme.mobile} {
    width: 30px;
    height: 30px;
  }
`;

const ProfileName = styled.div`
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  @media ${(props) => props.theme.mobile} {
    width: 160px;
  }
`;
