import { authService, dbService } from '@/firebase';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import MyCollectPost from './MyCollectPost';
import Masonry from 'react-responsive-masonry';
import { useState } from 'react';
import { uuidv4 } from '@firebase/util';
import Link from 'next/link';
import Image from 'next/image';

const CollectionCategory = ({ value, postData, collectionData }: any) => {
  const [more, setMore] = useState(true);
  //* post CollectionCategory 기준 데이터 가져오기
  const getTownDatas = async ({ queryKey }: { queryKey: string[] }) => {
    const [_, town] = queryKey;
    const response: { id: string }[] = [];
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
  const collectorList = collectionData?.filter((item: { collector: any[] }) => {
    return item.collector?.find((item) =>
      authService.currentUser?.uid.includes(item)
    );
  });

  //* 내가 담은 collection의 uid값
  const myCollectionUid = collectorList?.map((item: { uid: any }) => item.uid);
  //* 모든 포스터들 중 내가 담은 collection의 uid와 비교허여 일치하는 값
  const MyCollectionTownItem = data?.filter((item: { id: string }) =>
    myCollectionUid?.includes(item.id)
  );

  const onClickMoreBtn = () => {
    setMore(!more);
  };

  return (
    <div>
      {more ? (
        <TownWrap>
          <PostTownTitle>
            <CollectorTownTitle>{value}</CollectorTownTitle>
          </PostTownTitle>
          <MySpotImg>
            <Masonry columnsCount={2} style={{ gap: '-10px' }}>
              {MyCollectionTownItem?.map((item: { [key: string]: string }) => (
                <MyCollectPost item={item} key={uuidv4()} />
              ))}
            </Masonry>
          </MySpotImg>

          <MoreBtn onClick={onClickMoreBtn}>
            <MoreBtnContents>
              more
              <ArrowImg src={'/right-arrow.png'} />
            </MoreBtnContents>
          </MoreBtn>
        </TownWrap>
      ) : (
        <>
          <MoreDiv>
            <MorePostTownTitle>
              <MoreMyPostTownTitle>{value}</MoreMyPostTownTitle>
            </MorePostTownTitle>
            <Masonry columnsCount={4}>
              {MyCollectionTownItem?.map((item: any) => (
                <Link key={uuidv4()} href={`/detail/${item.id}`}>
                  <MyPostImg src={item.imgUrl} />
                </Link>
              ))}
            </Masonry>
            <MoreBtn onClick={onClickMoreBtn}>
              <MoreBtnContents>
                <ArrowImg src={'/arrow-left.png'} />
                back
              </MoreBtnContents>
            </MoreBtn>
          </MoreDiv>
        </>
      )}
    </div>
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
  margin-right: 16px;
  :hover {
    font-size: 15px;
    transition: all 0.3s;
  }
`;

const MoreBtnContents = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ArrowImg = styled.img`
  width: 12px;
  height: 12px;
  align-items: flex-end;
`;

const MoreDiv = styled.div`
  background-color: white;
  z-index: 100;
  position: absolute;
  width: 1200px;
  margin: auto;
  height: 1700px;
  top: 440px;
  left: 8%;
`;
const MyPostImg = styled.img`
  width: 275px;
  margin-bottom: 13px;
  :hover {
    transition: all 0.3s;
    transform: scale(1.02);
  }
`;

const MorePostTownTitle = styled.div`
  height: 43px;
  border-bottom: 1px solid #212121;
  margin-bottom: 25px;
`;

const MoreMyPostTownTitle = styled.div`
  font-family: 'Noto Sans CJK KR';
  font-size: 20px;
  line-height: 30px;
  text-align: left;
  font-weight: 500;
  letter-spacing: -0.015em;
`;
