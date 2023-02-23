import Link from 'next/link';
import React from 'react';
import Masonry from 'react-responsive-masonry';
import styled from 'styled-components';

export default function MorePost({ item }: any) {
  console.log('item??:', item);
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <Link href={`/detail/${item.id}`}>
        <CollectionImg src={item.imgUrl} />
      </Link>
    </div>
  );
}
const CollectionImg = styled.img`
  width: 279px;
  margin-bottom: 20px;
  :hover {
    transition: all 0.3s;
    transform: scale(1.03);
  }
`;
