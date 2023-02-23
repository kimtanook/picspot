import { dbService } from '@/firebase';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import Masonry from 'react-responsive-masonry';
import { uuidv4 } from '@firebase/util';
import UserCollectItem from './UserItem';

const UserTown = ({
  town,
  userId,
  postList,
}: {
  town: string;
  userId: string | undefined;
  postList: { [key: string]: (string | number)[] };
}) => {
  //* post town 기준 데이터 가져오기
  // 데이터를 다시 불러오기 때문에 비용문제가 발생할 수 있기 때문에,
  // UserPostList의 postList을 사용하여 기존 데이터를 이용하도록 리팩토링 예정
  const getTownData = async ({ queryKey }: { queryKey: string[] }) => {
    const [_, town] = queryKey;

    const response: { [key: string]: string }[] = [];

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

  //* useQuery 사용해서 town 데이터 불러오기
  const { data } = useQuery(['getTownData', town], getTownData);
  //* town데이터 creator 와 내 id가 같으면 그 item을 출력
  const myPostList = data?.filter(
    (item: { [key: string]: string | number }) => item.creator === userId
  );
  return (
    <div>
      <TownWrap>
        <PostTownTitle>
          <UserPostTownTitle>{town}</UserPostTownTitle>
        </PostTownTitle>
        <UserPostImgWrap>
          <Masonry columnsCount={2} style={{ gap: '-10px' }}>
            {myPostList?.map((item: { [key: string]: string }) => (
              <UserCollectItem key={uuidv4()} item={item} />
            ))}
          </Masonry>
        </UserPostImgWrap>
      </TownWrap>
    </div>
  );
};

export default UserTown;

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

const UserPostTownTitle = styled.div`
  font-family: 'Noto Sans CJK KR';
  font-size: 20px;
  line-height: 30px;
  text-align: left;
  font-weight: 500;
  letter-spacing: -0.015em;
`;
const UserPostImgWrap = styled.div`
  width: 390px;
  margin-top: 24px;
  height: 256px;
  overflow-y: scroll;
  display: grid;
`;
