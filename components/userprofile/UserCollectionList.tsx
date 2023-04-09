import { getCollection, getUserCollection } from '@/api';
import Image from 'next/image';
import { useQuery } from 'react-query';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import UserCollectionTown from './UserCollectionTown';
import { useRouter } from 'next/router';

const UserCollectionList = ({ userId }: { userId: string }) => {
  //* 특정 유저의 collection 데이터 불러오기
  const { data: collectionData, isLoading } = useQuery(
    ['UserCollection', userId],
    getUserCollection,
    {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
    }
  );

  const router = useRouter();

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
    <GridBox>
      {uniqueTownArray?.length === 0 ? (
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
            제주도 전체 사진 둘러보기 {'>'}
          </EmptyBtn>
        </EmptyPostBox>
      ) : (
        <>
          {typeof window === 'undefined' ? null : (
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 425: 1, 750: 2, 1200: 3 }}
            >
              <Masonry columnsCount={3}>
                {uniqueTownArray?.map((item: string) => (
                  <UserCollectionTown
                    key={uuidv4()}
                    value={item}
                    postList={collectionData}
                  />
                ))}
              </Masonry>
            </ResponsiveMasonry>
          )}
        </>
      )}
    </GridBox>
  );
};

export default UserCollectionList;

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
    width: 200px;
    height: 173px;
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
  width: 250px;
  text-align: center;
  margin-bottom: 10px;
`;
const EmptyBtn = styled.button`
  color: #1882ff;
  border: none;
  border-bottom: 1px solid #1882ff;
  background: none;
  cursor: pointer;
`;
