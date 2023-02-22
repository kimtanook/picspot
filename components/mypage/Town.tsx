import { authService, dbService } from '@/firebase';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import MyCollectItem from './MyCollectItem';
import Masonry from 'react-responsive-masonry';
import MorePost from './MorePost';
import { useState } from 'react';
import { isTemplateExpression } from 'typescript';

const Town = ({ value, setMore, more }: any) => {
  const [townName, setTownName] = useState('');
  const [scroll, setScroll] = useState(true);

  //* post town 기준 데이터 가져오기
  const getTownData = async ({ queryKey }: { queryKey: string[] }) => {
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
  //* => 해당 town의 data들
  const { data } = useQuery(['data', value], getTownData);
  // console.log('data:', data);

  //* town데이터 creator 와 내 id가 같으면 그 item을 출력
  const myPostList = data?.filter(
    (item: any) => item.creator === authService.currentUser?.uid
  );
  console.log('myPostList', myPostList);
  const a = myPostList?.map((item: any) => item.town);

  const onClickBtn = () => {
    setMore(false);
    setTownName(a);
  };
  // console.log('a', a);

  const myPostListMore = myPostList?.map((item: any) => item.town);
  // console.log('myPostListMore', myPostListMore);
  console.log('value', value);
  // console.log('myPostListMore', myPostListMore);
  // const good = myPostListMore.includes(value);
  // console.log(good);
  // console.log('townName', townName);

  // //* postData의 id가 collection uid와 같다면 postData id 출력하기
  // const postId = postData?.filter((item: any) =>
  //   collectorId?.includes(item.id)
  // );

  const MyPickMore = myPostList?.filter((item: any) => value.includes(item.id));
  const onClickTest = () => {
    setTownName(value);
    console.log('townName', townName);
    setMore(false);
  };
  //* 클릭한 town에 맞는 데이터들
  const onClickMoreData = myPostList?.filter((item: any) => {
    if (townName === item.town) {
      return item;
    }
  });
  console.log('onClickMoreData', onClickMoreData);

  return (
    <div>
      {/* {more ? ( */}

      <TownWrap>
        <PostTownTitle>
          <MyPostTownTitle>{value}</MyPostTownTitle>
        </PostTownTitle>
        {scroll ? (
          <MySpotImg>
            <Masonry columnsCount={2} style={{ gap: '-10px' }}>
              {myPostList?.map((item: any) => (
                <>
                  <MyCollectItem item={item} />
                </>
              ))}
            </Masonry>
          </MySpotImg>
        ) : (
          <MoreMySpotImg>
            <Masonry columnsCount={2} style={{ gap: '-10px' }}>
              {myPostList?.map((item: any) => (
                <>
                  <MyCollectItem item={item} />
                </>
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

      {/* // ) : ( */}
      {/* <>
          <Testdiv>
            <MyPostTownTitle>{townName}</MyPostTownTitle>
            <Masonry columnsCount={4} style={{ gap: '10px' }}>
              {onClickMoreData?.map((item: any) => (
                <MorePostList>
                  <MorePost item={item} />
                </MorePostList>
              ))}
            </Masonry>
          </Testdiv>
        </> */}
      {/* )} */}
    </div>
  );
};

export default Town;

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

const MyPostTownTitle = styled.div`
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

const MorePostList = styled.div`
  width: 1180px;
`;

const Testdiv = styled.div`
  margin: auto;
  width: 1188px;
`;
