import { getCollection, getUserCollection } from '@/api';
import Image from 'next/image';
import { useQuery } from 'react-query';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import UserCollectionTown from './UserCollectionTown';

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
            width={100}
            height={100}
          />
          <div>게시글이 없습니다.</div>
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
  top: 75%;
  left: 50%;
  transform: translate(-50%, -50%);
  & > .empty-image {
    width: 100%;
    height: 100%;
  }
`;
