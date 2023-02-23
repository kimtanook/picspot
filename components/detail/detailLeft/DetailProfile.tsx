import { getUser } from '@/api';
import { useQuery } from 'react-query';
import styled from 'styled-components';

const DetailProfile = ({ item }: any) => {
  //* useQuery 사용해서 유저 데이터 불러오기
  const { data: user } = useQuery('data', getUser);
  // console.log('user: ', user);

  return (
    <>
      {user
        ?.filter((obj: any) => obj.uid === item.creator)
        .map((obj: any) => (
          <StProfileCotainer key={obj.uid}>
            <StProfileImg src={obj.userImg} alt="image" />
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
  width: 60px;
  height: 60px;
  margin-right: 10px;
`;

const StProfileName = styled.div`
  /* font-size: 10px; */
`;
