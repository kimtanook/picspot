import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

interface ModalDefaultType {
  onClickToggleModal: () => void;
}

const Modal = ({ onClickToggleModal }: PropsWithChildren<ModalDefaultType>) => {
  return (
    <ModalContainer>
      <dialog open>Modal</dialog>
      <Backdrop
        onClick={(e) => {
          e.preventDefault();

          if (onClickToggleModal) {
            onClickToggleModal();
          }
        }}
      ></Backdrop>
    </ModalContainer>
  );
};

export default Modal;

const ModalContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Backdrop = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.2);
`;
