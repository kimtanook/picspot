import { authService, dbService } from '@/firebase';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { uuidv4 } from '@firebase/util';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import MyCollectItem from './MyCollectItem';

const CollectorCategory = ({ value }: { value: string }) => {
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

    return response;
  };

  //* useQuery 사용해서 데이터 불러오기
  const { data } = useQuery(['data', value], getTownData);
  const myPostList = data?.filter(
    (item: any) => item.creator === authService.currentUser?.uid
  );

  return (
    <TownWrap>
      <div>{value}</div>
      {myPostList?.map((item: any) => (
        <MyCollectItem key={uuidv4()} item={item} />
      ))}
    </TownWrap>
  );
};

export default CollectorCategory;

const TownWrap = styled.div`
  width: 300px;
  height: 300px;
  border: solid 1px tomato;
`;
