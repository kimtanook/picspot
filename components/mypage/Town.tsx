import { authService, dbService } from '@/firebase';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import MyCollectItem from './MyCollectItem';
import Masonry from 'react-responsive-masonry';
import MorePost from './MorePost';
import { useState } from 'react';
import { uuidv4 } from '@firebase/util';
import { isTemplateExpression } from 'typescript';

const Town = ({ value }: any) => {
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

  //* town데이터 creator 와 내 id가 같으면 그 item을 출력
  const myPostList = data?.filter(
    (item: any) => item.creator === authService.currentUser?.uid
  );
  console.log('myPostList', myPostList);
  const a = myPostList?.map((item: any) => item.town);
  return (
    <div>
      <TownWrap>
        <PostTownTitle>
          <MyPostTownTitle>{value}</MyPostTownTitle>
        </PostTownTitle>
        {scroll ? (
          <MySpotImg>
            <Masonry columnsCount={2} style={{ gap: '-10px' }}>
              {myPostList?.map((item: any) => (
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
  :hover {
    font-size: 15px;
    transition: all 0.3s;
  }
`;

////////////////////////////////? 더보기 more 버튼기능 로직입니다 ( 중간발표 후 작업하겠습니다)//////////////////////////////
// const [townName, setTownName] = useState('');
// const onClickBtn = () => {
//   setMore(false);
//   setTownName(a);
// };
//* postData의 id가 collection uid와 같다면 postData id 출력하기
// const postId = postData?.filter((item: any) =>
//   collectorId?.includes(item.id)
// );
// return
//   <Testdiv>
//     <MyPostTownTitle>{townName}</MyPostTownTitle>
//     <Masonry columnsCount={4} style={{ gap: '10px' }}>
//       {onClickMoreData?.map((item: any) => (
//         <MorePostList>
//           <MorePost item={item} />
//         </MorePostList>
//       ))}
//     </Masonry>
//   </Testdiv>
// </> */}
// const MorePostList = styled.div`
//   width: 1180px;
// `;
// const Testdiv = styled.div`
//   margin: auto;
//   width: 1188px;
// `;
////////////////////////////////?////////////////////////////////?////////////////////////////////?
