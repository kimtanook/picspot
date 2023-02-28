import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

export default function UserItem({ item }: { item: userItem }) {
  return (
    <Link href={`/detail/${item.uid}`}>
      <UserPostImg src={item.imgUrl} />
    </Link>
  );
}

const UserPostImg = styled.img`
  width: 170px;
  margin-bottom: 10px;
  :hover {
    transition: all 0.3s;
    transform: scale(1.03);
  }
`;
