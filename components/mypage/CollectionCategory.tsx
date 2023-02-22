import { authService, dbService } from '@/firebase';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import MyCollectPost from './MyCollectPost';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useState } from 'react';

const CollectionCategory = ({ value, postData, collectionData }: any) => {
  const [scroll, setScroll] = useState(true);
  //* post CollectionCategory 기준 데이터 가져오기
  const getTownDatas = async ({ queryKey }: { queryKey: string[] }) => {
    const [_, town] = queryKey;
    const response: any = [];
    let q = query(
      collection(dbService, 'post'),
      where('town', '==', town),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      response.push({ id: doc.id, ...doc.data() });
    });
    console.log('컬렉션 카테고리 데이터를 불러왔습니다.');

    return response;
  };

  //* useQuery 사용해서 town 데이터 불러오기
  const { data } = useQuery(['data', value], getTownDatas);
  // console.log('data:', data);
  //!

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
  // console.log('collectorID', postId);
  //* town데이터 postId가 내 postID의 id와 같은 data만 추력
  const myColelctList = data?.filter((item: any) => item.uid === postId.id);
  // console.log('myColelctList', myColelctList);

  return (
    <TownWrap>
      <PostTownTitle>
        <CollectorTownTitle>{value}</CollectorTownTitle>
      </PostTownTitle>
      {scroll ? (
        <MySpotImg>
          <Masonry columnsCount={2} style={{ gap: '-10px' }}>
            {myColelctList?.map((item: any) => (
              <MyCollectPost item={item} />
            ))}
          </Masonry>
        </MySpotImg>
      ) : (
        <MoreMySpotImg>
          <Masonry columnsCount={2} style={{ gap: '-10px' }}>
            {myColelctList?.map((item: any) => (
              <MyCollectPost item={item} />
            ))}
          </Masonry>
        </MoreMySpotImg>
      )}

      <MoreBtn
        onClick={() => {
          setScroll(!scroll);
        }}
      >
        more
      </MoreBtn>
    </TownWrap>
  );
};

export default CollectionCategory;

const TownWrap = styled.div`
  width: 365px;
  height: 352px;

  margin: 0px 1px 30px 1px;
  padding-right: 25px;
`;

const PostTownTitle = styled.div`
  height: 43px;
  border-bottom: 1px solid #212121;
`;
const CollectorTownTitle = styled.div`
  font-family: 'Noto Sans CJK KR';
  font-size: 20px;
  line-height: 30px;
  text-align: left;
  font-weight: 500;
  letter-spacing: -0.015em;
`;

const MySpotImg = styled.div`
  width: 390px;
  margin-top: 24px;
  height: 256px;
  overflow: hidden;
  display: grid;
`;
const MoreMySpotImg = styled.div`
  width: 390px;
  margin-top: 24px;
  height: 256px;
  overflow: scroll;
  display: grid;
`;

const MoreBtn = styled.button`
  width: 35px;
  height: 22px;
  font-weight: 400;
  font-size: 14px;
  line-height: 25px;
  align-items: center;
  text-align: center;
  text-decoration-line: underline;
  float: right;
  margin-top: 20px;
  border: none;
  background-color: white;
  /* border-bottom: 1px solid #555555; */
  :hover {
    font-size: 15px;
    transition: all 0.3s;
  }
`;
