import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

export default function MorePost({ item }: any) {
  return (
    <Link href={`/detail/${item.id}`}>
      <h1>더보기 기능 구현할 예정입니다!!</h1>
      <CollectionImg src={item.imgUrl} />
    </Link>
  );
}
const CollectionImg = styled.img`
  width: 170px;
  margin-bottom: 10px;
  :hover {
    transition: all 0.3s;
    transform: scale(1.03);
  }
`;
