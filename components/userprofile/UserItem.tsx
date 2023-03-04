import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

export default function UserItem({ item }: { item: userItem }) {
  return (
    <Link href={`/detail/${item.id}`}>
      <UserPostImg src={item.imgUrl} />
    </Link>
  );
}

const UserPostImg = styled.img`
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
