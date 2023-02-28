import { getCollection } from '@/api';
import { useQuery } from 'react-query';
import { v4 as uuidv4 } from 'uuid';
import UserCollectionTown from './UserCollectionTown';

const UserCollectionList = ({ userId }: { userId: string }) => {
  //* useQuery 사용해서 collection 데이터 불러오기
  const { data: collectionData, isLoading } = useQuery(
    'UserCollection',
    getCollection
  );

  // filter로 거른다 (collectionData의 collector 중에서, userId가 true인 item을. )
  const userCollectPost = collectionData?.filter((item: userItem) =>
    item.collector?.find((item: string) => item.includes(userId))
  );

  // town값만 추출
  const townArray = collectionData?.map((item: userItem) => {
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
      {uniqueTownArray?.map((item: string) => (
        <UserCollectionTown
          key={uuidv4()}
          value={item}
          postList={userCollectPost}
        />
      ))}
    </>
  );
};

export default UserCollectionList;
