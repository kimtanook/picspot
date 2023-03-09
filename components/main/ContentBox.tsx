import { getUserCollection } from '@/api';
import { authService } from '@/firebase';
import Image from 'next/image';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import Content from './Content';

function ContentBox({ item }: any) {
  const [collectHover, setCollectHover] = useState(false);
  // 특정 유저의 컬렉션 데이터 가져오기
  const { data: userCollectData } = useQuery(
    ['userCollectData', authService.currentUser?.uid],
    getUserCollection
  );

  return (
    <Wrap>
      <ImageWrap
        onMouseOver={() => setCollectHover(true)}
        onMouseOut={() => setCollectHover(false)}
      >
        {collectHover ? (
          <Image
            src="/main/hover.png"
            alt="hover-collect"
            layout="responsive"
            width={50}
            height={50}
            style={{ position: 'absolute' }}
          />
        ) : null}
        <Content
          item={item}
          userCollectData={userCollectData}
          collectHover={collectHover}
        />
      </ImageWrap>
    </Wrap>
  );
}

export default ContentBox;
const Wrap = styled.div`
  margin: 0 5px 0 5px;
`;

const ImageWrap = styled.div`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
`;
