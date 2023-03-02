import { getCollection } from '@/api';
import { authService } from '@/firebase';
import { useQuery } from 'react-query';
import CollectionCategory from './CollectionCategory';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { v4 as uuidv4 } from 'uuid';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';

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
    (element: string, index: number) => {
      return myCollectionTown?.indexOf(element) === index;
    }
  );

  const isPc = useMediaQuery({
    query: '(min-width: 425px)',
  });
  const isMobile = useMediaQuery({
    query: '(max-width: 425px)',
  });
  return (
    <GridBox>
      <ResponsiveMasonry columnsCountBreakPoints={{ 425: 1, 750: 2, 1200: 3 }}>
        <Masonry columnsCount={3}>
          {myCollectionTownArr?.map((item: string) => (
            <CollectionCategory
              key={uuidv4()}
              value={item}
              collectorList={collectorList}
            />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </GridBox>
  );
};

export default CollectionList;
const GridBox = styled.div`
  margin: 0px 1%;
  width: 100%;
  @media ${(props) => props.theme.mobile} {
    width: 100%;
  }
`;
