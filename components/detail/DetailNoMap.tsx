import { addData, getDatas, postCounter, updataData } from '@/api';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import ReactGA from 'react-ga';

export const DetailNoMap = () => {
  const { data, isLoading, isError } = useQuery('datas', getDatas);
  // console.log('data', data);

  // const queryClient = useQueryClient();
  // const { mutate: countMutate } = useMutation(postCounter, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries('post');
  //   },
  // });

  // useEffect(() => {
  //   countMutate();
  // }, []);
  // const onClickCounter = () => {
  //   for (let i = 0; i < 3; i++) setCount(count + 1);
  // };

  // console.log(window.location);
  return (
    <>
      {data?.map((item: any) => (
        <PostList>
          <PostItem>
            <Image src={item.imgUrl} alt="image" height={100} width={100} />
            <div>{item.title}</div>
          </PostItem>
        </PostList>
      ))}
    </>
  );
};

const PostList = styled.div`
  display: inline-block;
  padding: 20px;
`;

const PostItem = styled.button`
  border: solid 1px tomato;
  width: 200px;
  height: 200px;
`;
