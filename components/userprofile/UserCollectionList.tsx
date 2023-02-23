import { getCollection, getData } from '@/api';
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
  const userCollectPost = collectionData?.filter((item: any) =>
    item.collector.find((item: any) => item.includes(userId))
  );
  // 거른 컬렉션의 Uid 추출
  const postUid = userCollectPost?.map((item: any) => item.uid);

  // 게시물 데이터 가져오기
  const { data: postData } = useQuery('getUserPostData', getData);

  // 게시물 id와 추출한 Uid가 같은 포스트 추출
  const userCollectionTown = postData?.filter((item: any) =>
    postUid?.includes(item.id)
  );

  // id와 Uid가 같은 포스트의 모든 town
  const townArray = userCollectionTown?.map((item: any) => {
    return item.town;
  });

  // 모든 town의 중복 제거
  const uniqueTownArray = townArray?.filter((element: any, index: any) => {
    return townArray?.indexOf(element) === index;
  });

  return (
    <>
      {uniqueTownArray?.map((item: any) => (
        <UserCollectionTown key={uuidv4()} value={item} postUid={postUid} />
      ))}
    </>
  );
};

export default UserCollectionList;
