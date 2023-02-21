import { authService, dbService } from '@/firebase';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import MyCollectPost from './MyCollectPost';

const CollectionCategory = ({ value, postData, collectionData }: any) => {
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
      <div>{value}</div>
      {myColelctList?.map((item: any) => (
        <MyCollectPost item={item} />
      ))}
    </TownWrap>
  );
};

export default CollectionCategory;

const TownWrap = styled.div`
  width: 300px;
  height: 300px;
  border: solid 1px tomato;
`;
