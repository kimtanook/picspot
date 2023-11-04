import { getUserCollection } from '@/api';
import { authService } from '@/firebase';
import Image from 'next/image';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import Content from './Content';

function ContentBox({ item }: any) {
  const [collectHover, setCollectHover] = useState(false);
  // 특정 유저(나 제외 다른 유저페이지)의 컬렉션 데이터 가져오기
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
            className="image-wrap"
            width={50}
            height={50}
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
  & > .image-wrap {
    width: 100%;
    position: absolute;
    z-index: 1;
    @media ${(props) => props.theme.mobile} {
      display: none;
    }
  }
`;
