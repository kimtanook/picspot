import { getData } from '@/api';
import { useQuery } from 'react-query';
import { uuidv4 } from '@firebase/util';
import Masonry from 'react-responsive-masonry';
import UserTown from './UserPostTown';

const UserPostList = ({ userId }: { userId: string }) => {
  //* useQuery 사용해서 데이터 불러오기
  const { data } = useQuery('getUserData', getData);

  //* 전체에서 가져온 데이터에서 현재 프로필 유저가 작성한 포스터들
  const postList = data?.filter((item: { [key: string]: string }) => {
    if (item.creator === userId) {
      return item.id;
    }
  });
  //* 현재 프로필 유저가 작성한 포스트들의 town 값 배열
  const townArray = postList?.map((item: { town: string }) => item.town);

  //town 값 배열의 중복 제거
  const uniqueTownArray = townArray?.filter((element: any, index: any) => {
    return townArray?.indexOf(element) === index;
  });
  return (
    <>
      <Masonry columnsCount={3} style={{ gap: '45px' }}>
        {uniqueTownArray?.map((item: string) => (
          <div key={uuidv4()}>
            <UserTown town={item} userId={userId} postList={postList} />
          </div>
        ))}
      </Masonry>
    </>
  );
};

export default UserPostList;
