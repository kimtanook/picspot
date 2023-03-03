import { getMyPost } from '@/api';
import { useQuery } from 'react-query';
import { uuidv4 } from '@firebase/util';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import UserTown from './UserPostTown';
import styled from 'styled-components';

const UserPostList = ({ userId }: { userId: string }) => {
  //* useQuery 사용해서 데이터 불러오기
  const { data } = useQuery(['getUserData', userId], getMyPost);

  //* 현재 프로필 유저가 작성한 포스트들의 town 값 배열
  const townArray = data?.map((item: { town: string }) => item.town);

  //* town 값 배열의 중복 제거
  const uniqueTownArray = townArray?.filter(
    (element: string, index: number) => {
      return townArray?.indexOf(element) === index;
    }
  );

  return (
    <GridBox>
      <ResponsiveMasonry columnsCountBreakPoints={{ 425: 1, 750: 2, 1200: 3 }}>
        <Masonry columnsCount={3}>
          {uniqueTownArray?.map((item: string) => (
            <div key={uuidv4()}>
              <UserTown town={item} postList={data} />
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </GridBox>
  );
};

export default UserPostList;

const GridBox = styled.div`
  margin: 0px 1%;
  width: 100%;
  @media ${(props) => props.theme.mobile} {
    width: 100%;
  }
`;
