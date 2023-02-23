import { dbService } from '@/firebase';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import Masonry from 'react-responsive-masonry';
import UserItem from './UserItem';
import { v4 as uuidv4 } from 'uuid';

const UserCollectionTown = ({ value, postUid }: any) => {
  // * post CollectionCategory 기준 데이터 가져오기
  const getTownData = async ({ queryKey }: { queryKey: any }) => {
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

  const { data } = useQuery(['getPostTownData', value], getTownData);

  // 가져온 게시글 데이터와 컬렉션 Uid와 같은 게시글 추출
  const collectionData = data?.filter((item: any) =>
    postUid?.includes(item.id)
  );

  // town과 현재 town value가 같은 게시글 추출
  const townSameValueData = collectionData?.filter(
    (item: any) => item.town === value
  );
  return (
    <TownWrap>
      <PostTownTitle>
        <CollectorTownTitle>{value}</CollectorTownTitle>
      </PostTownTitle>
      <MySpotImg>
        <Masonry columnsCount={2} style={{ gap: '-10px' }}>
          {townSameValueData?.map((item: any) => (
            <UserItem key={uuidv4()} item={item} />
          ))}
        </Masonry>
      </MySpotImg>
      <MoreBtn>more</MoreBtn>
    </TownWrap>
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
  :hover {
    font-size: 15px;
    transition: all 0.3s;
  }
`;
