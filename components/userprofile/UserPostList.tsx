import { getMyPost } from '@/api';
import { useQuery } from 'react-query';
import { uuidv4 } from '@firebase/util';
import Masonry from 'react-responsive-masonry';
import UserTown from './UserPostTown';

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
    <>
      <Masonry columnsCount={3} style={{ marginRight: '27px' }}>
        {uniqueTownArray?.map((item: string) => (
          <div key={uuidv4()}>
            <UserTown town={item} postList={data} />
          </div>
        ))}
      </Masonry>
    </>
  );
};

export default UserPostList;
