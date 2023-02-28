import { getCollection } from '@/api';
import { authService } from '@/firebase';
import { useQuery } from 'react-query';
import CollectionCategory from './CollectionCategory';
import Masonry from 'react-responsive-masonry';
import { v4 as uuidv4 } from 'uuid';

const CollectionList = () => {
  //* useQuery 사용해서 collection의 모든 데이터 불러오기
  const { data: collectionData } = useQuery('collectiondata2', getCollection);

  //* collector에서 내 id를 가진 값 찾기
  const collectorList = collectionData?.filter((item: any) => {
    return item.collector.find((item: any) =>
      authService.currentUser?.uid.includes(item)
    );
  });

  //* 내가 collect한 포스터 들의 town
  const myCollectionTown = collectorList?.map((item: any) => {
    return item.town;
  });

  //* 배열에서 중복된 town 값 합치기
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
            collectorList={collectorList}
          />
        ))}
      </Masonry>
    </>
  );
};

export default CollectionList;
