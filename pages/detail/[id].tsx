import { getDatas } from '@/api';
import Seo from '@/components/Seo';
import { dbService } from '@/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Map } from 'react-kakao-maps-sdk';
import { useQueries, useQuery } from 'react-query';
import styled from 'styled-components';

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log('router: ', router);

  const { data, isLoading, isError } = useQuery('detailData', getDatas);
  console.log('data: ', data);

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
