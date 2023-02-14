import { DetailNoMap } from '@/components/detail/DetailNoMap';
import Seo from '@/components/Seo';
import { Map } from 'react-kakao-maps-sdk';
import { addData, getDatas, postCounter, updataData } from '@/api';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';

export default function detail() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery('datas', getDatas);

  const { mutate: countMutate } = useMutation(postCounter, {
    onSuccess: () => {
      queryClient.invalidateQueries('datas');
    },
  });

  useEffect(() => {
    countMutate();
  }, []);
  // console.log(data);

  if (isLoading) return <h1>로딩 중입니다.</h1>;
  if (isError) return <h1>에러가 있습니다.</h1>;
  return (
    <div>
      <Seo title="Detail" />
      <div>
        <Map
          center={{
            lat: 33.450701,
            lng: 126.570667,
          }}
          style={{
            width: '100%',
            height: '450px',
          }}
          level={6}
        />
      </div>
      <DetailNoMap />

      {data?.map((item: any) => (
        <Test>
          <div key={item.id}>
            <div>{item.clickCounter}</div>
          </div>
        </Test>
      ))}
    </div>
  );
}

const Test = styled.div`
  border: solid 1px tomato;
  display: inline-block;
  width: 100px;
  height: 100px;
  margin: 20px;
`;
