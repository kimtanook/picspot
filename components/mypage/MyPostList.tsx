import { getCollection, getData, getTownData, getTownDataJeju } from '@/api';
import { authService } from '@/firebase';
import Image from 'next/image';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import Link from 'next/link';
import { useState } from 'react';
import { uuidv4 } from '@firebase/util';
import Town from './Town';

const MyPostList = () => {
  //* useQuery 사용해서 데이터 불러오기
  const { data } = useQuery('data', getData);
  //* 전체에서 가져온 데이터에서 내가 작성한 포스터들만 가져왔다.
  const a = data?.map((item: any) => {
    if (item.creator === authService.currentUser?.uid) {
      return item.id;
    }
  });

  // * 내가만든 데이터를 post 데이터와 교집합하여 데이터를 꺼냄
  const categoryId = data?.filter((item: any) => a?.includes(item.id));
  const b = categoryId?.filter((item: any) => {
    return item.town;
  });
  const c = b?.map((item: any) => {
    return item.town;
  });

  const d = [...new Set(c)];

  console.log('게시물들', d);

  return (
    <>
      <div>{d[0]}</div>
      <div>d</div>
      <div>{d[1]}</div>
      <div>{d[2]}</div>
      {categoryId?.map((item: any) => (
        <div>
          <Town value={d[0]} data={item} />
          {/* <div>{item.town}</div> */}
        </div>
      ))}
    </>
  );
};

export default MyPostList;
