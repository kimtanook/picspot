import React from 'react';
import styled from 'styled-components';

function Loading() {
  return (
    <LoadingImgWrap>
      <LoadingImg src="/loading.gif" />
    </LoadingImgWrap>
  );
}

export default Loading;

const LoadingImgWrap = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(35, 35, 35, 0.126);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const LoadingImg = styled.img`
  width: 70px;
  height: 70px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
