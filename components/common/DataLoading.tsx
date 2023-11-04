import React from 'react';
import styled, { keyframes, Keyframes } from 'styled-components';

function DataLoading() {
  return (
    <>
      {/* <Div>
        <div
          style={{
            position: 'relative',
          }}
        > */}
      <LoadingImgWrap>
        <LoadingWrap>
          <BigLoading />
          <SmallLoading />
        </LoadingWrap>
        <LoadingWrap>
          <SmallLoading />
          <BigLoading />
        </LoadingWrap>
        <LoadingWrap>
          <BigLoading />
          <SmallLoading />
        </LoadingWrap>
        <LoadingWrap>
          <SmallLoading />
          <BigLoading />
        </LoadingWrap>
      </LoadingImgWrap>
      {/* </div>
      </Div> */}
    </>
  );
}

export default DataLoading;

const slideRight = keyframes`
  0% {
    transform: translateX(0);
  }
  50%,
  100% {
    transform: translateX(100vw);
  }
`;

const Div = styled.div`
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 100%;
  background: linear-gradient(to right, #f2f2f2, #ddd, #f2f2f2);
  animation: ${slideRight} 1s infinite linear;
  /* overflow: hidden;
  position: relative; */
`;

const LoadingWrap = styled.div`
  width: 27%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 10px;
`;

const BigLoading = styled.div`
  width: 100%;
  height: 70%;
  background-color: #f1f1f1;
`;

const SmallLoading = styled.div`
  width: 100%;
  height: 30%;
  background-color: #f1f1f1;
`;
const LoadingImgWrap = styled.div`
  width: 100%;
  height: 80vh;
  padding: 10px 10% 10px 10%;
  display: flex;
`;
