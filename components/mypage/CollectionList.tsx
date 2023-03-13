import { getCollection } from '@/api';
import { authService } from '@/firebase';
import { useQuery } from 'react-query';
import CollectionCategory from './CollectionCategory';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
const CollectionList = () => {
  //* useQuery 사용해서 collection의 모든 데이터 불러오기
  const { data: collectionData } = useQuery('myCollectiondata', getCollection, {
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });

  //* collector에서 내 id를 가진 값 찾기
  const collectorList = collectionData?.filter(
    (item: { collector: string[] }) => {
      return item.collector.find((item: string) =>
        authService.currentUser?.uid.includes(item)
      );
    }
  );

  //* 내가 collect한 포스터 들의 town
  const myCollectionTown = collectorList?.map((item: { town: string }) => {
    return item.town;
  });

  //* 배열에서 중복된 town 값 합치기
  const myCollectionTownArr = myCollectionTown?.filter(
    (element: string, index: number) => {
      return myCollectionTown?.indexOf(element) === index;
    }
  );
  const router = useRouter();
  return (
    <GridBox>
      {myCollectionTown?.length === 0 ? (
        <EmptyPostBox>
          <Image
            src="/main/empty-icon.png"
            alt="empty-icon"
            className="empty-image"
            width={200}
            height={200}
          />
          <EmptyTitle>아직 저장된 사진이 없어요.</EmptyTitle>
          <EmptyContetnts>
            가보고 싶은 여행지 사진을 찾으러 가볼까요?
          </EmptyContetnts>
          <EmptyBtn onClick={() => router.push('/main?city=제주전체')}>
            제주도 전체 사진 둘러보기
          </EmptyBtn>
        </EmptyPostBox>
      ) : (
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 425: 1, 750: 2, 1200: 3 }}
        >
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
      )}
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
const EmptyPostBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  padding-top: 10px;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  & > .empty-image {
    width: 100%;
    height: 100%;
  }
`;

const EmptyTitle = styled.div`
  margin: 24px 0px 15px 0px;
  font-size: 16px;
  font-weight: 500;
`;

const EmptyContetnts = styled.div`
  font-size: 24px;
  font-weight: 700;
  width: 260px;
  text-align: center;
`;
const EmptyBtn = styled.button`
  color: #1882ff;
  border: none;
  border-bottom: 1px solid #1882ff;
  background: none;
  cursor: pointer;
`;
