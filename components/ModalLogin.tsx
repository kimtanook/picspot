import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import Auth from './main/Auth';

function ModalLogin(props: {
  closeModal: () => void;
  children: any;
  wide?: string;
}) {
  function closeModal() {
    props.closeModal();
  }
  // 모달창이 나왔을때 백그라운드 클릭이 안되게 하고 스크롤도 고정하는 방법
  useEffect(() => {
    document.body.style.cssText = `
      position: fixed; 
      top: -${window.scrollY}px;
      overflow-y: scroll;
      width: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = '';
      window.scrollTo(0, parseInt(scrollY) * -1);
    };
  }, []);

  return (
    <ModalStyled
      onClick={closeModal}
      wide={props.wide === 'string' ? props.wide : ''}
    >
      <div className="modalBody" onClick={(e) => e.stopPropagation()}>
        {props.children}
        <Auth />
      </div>
    </ModalStyled>
  );
}

export default ModalLogin;

const ModalStyled = styled.div<{ wide: string }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  z-index: 10;
  justify-content: center;
  align-items: center;
  .modalBody {
    position: absolute;
    color: black;
    ${(props) =>
      props.wide
        ? css`
            width: 400px;
            height: 430px;
          `
        : css`
            width: 230px;
            height: 230px;
          `}
    padding: 30px 30px 30px 30px;
    z-index: 13;
    text-align: left;
    background-color: rgb(255, 255, 255);
    border-radius: 20px;
    box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
  }
  #modalCloseBtn {
    position: absolute;
    top: 215px;
    z-index: 11;
    right: 28px;
    border: 1px solid rgb(220, 220, 220);
    width: 80%;
    height: 15%;
    border-radius: 12%/60%;
    color: rgba(0, 0, 0, 0.7);
    background-color: transparent;
    font-size: 3vmin;
    font-weight: 600;
    transition: 0.3s;
    font-family: 'neodgm';
    &:hover {
      background-color: rgb(230, 230, 230);
      cursor: pointer;
    }
  }
`;
