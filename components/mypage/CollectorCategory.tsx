import { getCollection, getData, getTownData, getTownDataJeju } from '@/api';
import { authService, dbService } from '@/firebase';
import Image from 'next/image';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { uuidv4 } from '@firebase/util';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import MyPostList from './MyPostList';
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
    console.log('컬렉션 카테고리 데이터를 불러왔습니다.');

    return response;
  };

  //* useQuery 사용해서 데이터 불러오기
  const { data } = useQuery(['data', value], getTownData);
  // console.log('data:', data);
  const myPostList = data?.filter(
    (item: any) => item.creator === authService.currentUser?.uid
  );
  console.log('myPostList', myPostList);

  return (
    <TownWrap>
      <div>{value}</div>
      {myPostList?.map((item: any) => (
        <MyCollectItem item={item} />
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
