import { getCollection } from '@/api';
import { authService } from '@/firebase';
import { useQuery } from 'react-query';
import CollectionCategory from './CollectionCategory';
import Masonry from 'react-responsive-masonry';
import { v4 as uuidv4 } from 'uuid';

const CollectionList = ({ postData }: any) => {
  //* useQuery 사용해서 collection 데이터 불러오기
  const { data: collectionData } = useQuery('collectiondata2', getCollection);

  //* collector들 닉네임 뽑아오기
  //* collector에서 내 id를 가진 값 찾기
  const collectorList = collectionData?.filter((item: any) => {
    return item.collector.find((item: any) =>
      authService.currentUser?.uid.includes(item)
    );
  });
  //* 내 id와 맞는 collector의 uid값 출력
  const collectorId = collectorList?.map((item: any) => {
    return item.uid;
  });

  //* postData의 id가 collection uid와 같다면 postData id 출력하기
  const postId = postData?.filter((item: any) =>
    collectorId?.includes(item.id)
  );
  //* 내 collection의 postId중 town값만 출력
  const myCollectionTown = postId?.map((item: any) => {
    return item.town;
  });
  //* 배열에서 중복된 값 합치기
  const myCollectionTownArr = myCollectionTown?.filter(
    (element: any, index: any) => {
      return myCollectionTown?.indexOf(element) === index;
    }
  );
  return (
    <>
      <Masonry columnsCount={3} style={{ gap: '45px' }}>
        {myCollectionTownArr?.map((item: any) => (
          <CollectionCategory
            key={uuidv4()}
            value={item}
            postData={postData}
            collectionData={collectionData}
          />
        ))}
      </Masonry>
    </>
  );
};

export default CollectionList;
