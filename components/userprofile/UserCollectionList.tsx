import { getCollection } from '@/api';
import { useQuery } from 'react-query';
import Masonry from 'react-responsive-masonry';
import { v4 as uuidv4 } from 'uuid';
import UserCollectionTown from './UserCollectionTown';

const UserCollectionList = ({ userId }: { userId: string }) => {
  //* useQuery 사용해서 collection 데이터 불러오기
  const { data: collectionData, isLoading } = useQuery(
    'UserCollection',
    getCollection
  );

  // filter로 거른다 (collectionData의 collector 중에서, userId가 true인 item을. )
  const userCollectPost = collectionData?.filter((item: userItem) => {
    return item.collector?.find((item: string) => userId.includes(item));
  });

  // town값만 추출
  const townArray = userCollectPost?.map((item: userItem) => {
    return item.town;
  });

  // 모든 town의 중복 제거
  const uniqueTownArray = townArray?.filter(
    (element: string, index: number) => {
      return townArray?.indexOf(element) === index;
    }
  );
  return (
    <>
      <Masonry columnsCount={3} style={{ marginRight: '27px' }}>
        {uniqueTownArray?.map((item: string) => (
          <UserCollectionTown
            key={uuidv4()}
            value={item}
            postList={userCollectPost}
          />
        ))}
      </Masonry>
    </>
  );
};

export default UserCollectionList;
