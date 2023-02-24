import { authService, dbService } from '@/firebase';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import MyCollectPost from './MyCollectPost';
import Masonry from 'react-responsive-masonry';
import { useState } from 'react';
import { uuidv4 } from '@firebase/util';

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

    return response;
  };

  //* useQuery 사용해서 내가 컬렉션한 포스터의 town의 모든 postData들
  const { data } = useQuery(['data', value], getTownDatas);

  //* 모든 collection중 내가 collector에 내이름이 있는(내가 선택한) 포스터들
  const collectorList = collectionData?.filter((item: any) => {
    return item.collector?.find((item: any) =>
      authService.currentUser?.uid.includes(item)
    );
  });

  //* 내가 담은 collection의 uid값
  const myCollectionUid = collectorList?.map((item: any) => item.uid);
  //* 모든 포스터들 중 내가 담은 collection의 uid와 비교허여 일치하는 값
  const MyCollectionTownItem = data?.filter((item: any) =>
    myCollectionUid?.includes(item.id)
  );

  return (
    <TownWrap>
      <PostTownTitle>
        <CollectorTownTitle>{value}</CollectorTownTitle>
      </PostTownTitle>
      {scroll ? (
        <MySpotImg>
          <Masonry columnsCount={2} style={{ gap: '-10px' }}>
            {MyCollectionTownItem?.map((item: any) => (
              <MyCollectPost item={item} key={uuidv4()} />
            ))}
          </Masonry>
        </MySpotImg>
      ) : (
        <MoreMySpotImg>
          <Masonry columnsCount={2} style={{ gap: '-10px' }}>
            {MyCollectionTownItem?.map((item: any) => (
              <MyCollectPost item={item} key={uuidv4()} />
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
  :hover {
    font-size: 15px;
    transition: all 0.3s;
  }
`;
