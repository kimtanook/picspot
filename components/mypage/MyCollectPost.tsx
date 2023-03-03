import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

export default function MyCollectPost({
  item,
}: {
  item: { [key: string]: string };
}) {
  return (
    <Link href={`/detail/${item.id}`}>
      <CollectionImg src={item.imgUrl} />
    </Link>
  );
}

const CollectionImg = styled.img`
  width: 100%;
  margin-bottom: 5px;
  :hover {
    transition: all 0.3s;
    transform: scale(1.03);
  }
  @media ${(props) => props.theme.mobile} {
    width: 96%;
  }
`;
