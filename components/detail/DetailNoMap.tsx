import { getDatas } from '@/api';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from 'react-query';
import styled from 'styled-components';

const DetailNoMap = () => {
  const { data, isLoading, isError } = useQuery('datas', getDatas);
  console.log('data: ', data);

  if (isLoading) return <h1>로딩 중입니다.</h1>;
  if (isError) return <h1>연결이 원활하지 않습니다.</h1>;

  return (
    <div>
      {data.map((item: any) => (
        <Link
          key={item.id}
          href={`/detail/${item.id}`}
          style={{ textDecoration: 'none' }}
        >
          <StDetailBox>
            <h1
              style={{
                textDecoration: 'none',
                color: 'black',
              }}
            >
              {item.title}
            </h1>
            <h3
              style={{
                textDecoration: 'none',
                color: 'black',
              }}
            >
              {item.city}
            </h3>
            <h3
              style={{
                textDecoration: 'none',
                color: 'black',
              }}
            >
              {item.town}
            </h3>
            <Image src={item.imgUrl} alt="image" height={100} width={100} />
          </StDetailBox>
        </Link>
      ))}
    </div>
  );
};

export default DetailNoMap;

const StDetailBox = styled.div`
  border: 1px solid black;
  padding: 10px;
  margin: 10px;
`;
