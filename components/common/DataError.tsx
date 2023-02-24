import React from 'react';
import styled from 'styled-components';

function DataError() {
  return (
    <LoadingImgWrap>
      <LoadingImg src="/error-icon2.png" />
    </LoadingImgWrap>
  );
}

export default DataError;

const LoadingImgWrap = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(159, 159, 159, 0.126);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
`;
const LoadingImg = styled.img`
  width: 100px;
  height: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
