import { getUser } from '@/api';
import { authService } from '@/firebase';
import Link from 'next/link';
import { useQuery } from 'react-query';
import styled from 'styled-components';

const DetailProfile = ({ item }: any) => {
  //* useQuery 사용해서 유저 데이터 불러오기
  const { data: user } = useQuery('data', getUser);
  return (
    <>
      {user
        ?.filter((obj: any) => obj.uid === item.creator)
        .map((obj: any) => (
          <StProfileCotainer key={obj.uid}>
            {authService.currentUser?.uid === obj.uid ? (
              <Link href={'/mypage'}>
                <StProfileImg src={obj.userImg} alt="image" />
              </Link>
            ) : (
              <Link
                href={{
                  pathname: `/userprofile/${obj.uid}`,
                  query: { name: obj.userName },
                }}
              >
                <StProfileImg src={obj.userImg} alt="image" />
              </Link>
            )}

            <StProfileName>{obj.userName}</StProfileName>
          </StProfileCotainer>
        ))}
    </>
  );
};

export default DetailProfile;

const StProfileCotainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 10px;
`;

const StProfileImg = styled.img`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin-right: 10px;
`;

const StProfileName = styled.div`
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
