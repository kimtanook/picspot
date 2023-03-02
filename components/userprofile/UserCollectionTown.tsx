import { dbService } from '@/firebase';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Masonry from 'react-responsive-masonry';
import UserItem from './UserItem';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import Link from 'next/link';

const UserCollectionTown = ({
  value,
  postList,
}: {
  value: string;
  postList: { [key: string]: string | number }[] | undefined;
}) => {
  const [more, setMore] = useState(true);

  //* town 기준 데이터들 가져오기
  const getTownDatas = async ({ queryKey }: { queryKey: string[] }) => {
    const [_, town] = queryKey;
    const response: { id: string }[] = [];
    let q = query(
      collection(dbService, 'collection'),
      where('town', '==', town)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      response.push({ id: doc.id, ...doc.data() });
    });

    return response;
  };

  //* 사용자가 collection한 town별 데이터들
  const { data: userCollectData } = useQuery(['datas', value], getTownDatas);
  //* 사용자가 담은 collection의 uid값
  const userCollectionUid = postList?.map((item: any) => item.uid);
  //* 모든 collection 중 사용자가 담은 collection의 uid와 비교하여 일치하는 값
  const userCollectionTownItem = userCollectData?.filter(
    (item: { id: string }) => userCollectionUid?.includes(item.id)
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
            <Masonry columnsCount={2} style={{ paddingRight: '25px' }}>
              {userCollectionTownItem?.map((item: any) => (
                <UserItem key={uuidv4()} item={item} />
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
          <FatherDiv>
            <MoreDiv>
              <MorePostTownTitle>
                <MoreMyPostTownTitle>{value}</MoreMyPostTownTitle>
              </MorePostTownTitle>
              <Masonry columnsCount={4}>
                {userCollectionTownItem?.map((item: any) => (
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
          </FatherDiv>
        </>
      )}
    </div>
  );
};

export default UserCollectionTown;

const TownWrap = styled.div`
  width: 365px;
  height: 352px;

  margin: 0px 1px 30px 1px;
  padding-right: 25px;
`;

const PostTownTitle = styled.div`
  height: 43px;
  border-bottom: 2px solid #212121;
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
  margin-right: 25px;
  :hover {
    font-size: 15px;
    transition: all 0.3s;
  }
`;

const FatherDiv = styled.div`
  background-color: white;
  width: 100vw;
  height: 100vw;
  position: absolute;
  left: 1px;
  overflow: hidden;
`;

const MoreDiv = styled.div`
  background-color: white;
  z-index: 100;
  position: absolute;
  width: 1188px;
  transform: translate(-50%, 0%);
  left: 50%;
  overflow: hidden;
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
