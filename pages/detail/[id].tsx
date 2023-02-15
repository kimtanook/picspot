import { getDatas, postCounter } from '@/api';
import Seo from '@/components/Seo';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Map } from 'react-kakao-maps-sdk';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';

const Post = ({ id }: any) => {
  //* useQuery 사용해서 데이터 불러오기
  const { data, isLoading, isError } = useQuery('detailData', getDatas);
  // console.log('data: ', data);
  const queryClient = useQueryClient();

  //* mutation 사용해서 counting값 보내기
  const { mutate: countMutate } = useMutation(postCounter, {
    onSuccess: () => {
      queryClient.invalidateQueries('detailData');
    },
  });

  //* 변화된 counting 값 인지
  useEffect(() => {
    countMutate(id);
    console.log('id:', id);
  }, []);
  console.log('data:', data);
  if (isLoading) return <h1>로딩 중입니다.</h1>;
  if (isError) return <h1>연결이 원활하지 않습니다.</h1>;

  return (
    <>
      <Seo title="Detail" />
      <div>
        <Map // 지도를 표시할 Container
          center={{
            // 지도의 중심좌표
            lat: 33.450701,
            lng: 126.570667,
          }}
          style={{
            // 지도의 크기
            width: '100%',
            height: '450px',
          }}
          level={6} // 지도의 확대 레벨
        />
      </div>
      {data
        .filter((item: any) => {
          return item.id === id;
        })
        .map((item: any) => (
          <StDetailBox key={item.id}>
            <h1>{item.title}</h1>
            <h3>{item.city}</h3>
            <h3>{item.town}</h3>
            <h3>{item.clickCounter}</h3>
            <Image src={item.imgUrl} alt="image" height={100} width={100} />
          </StDetailBox>
        ))}
    </>
  );
};

export default Post;

const StDetailBox = styled.div`
  border: 1px solid black;
  padding: 10px;
  margin: 10px;
`;

//* SSR방식으로 server에서 id 값 보내기
export async function getServerSideProps(context: { params: any }) {
  const { params } = context;
  const { id }: any = params;
  return {
    props: {
      id: id,
    },
  };
}
