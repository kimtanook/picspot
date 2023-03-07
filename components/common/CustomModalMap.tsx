import { Dispatch, SetStateAction, useEffect } from 'react';
import styled from 'styled-components';

interface ModalProps {
  modal: any;
  width: string;
  height: string;
  element: JSX.Element;
  setModal: Dispatch<SetStateAction<boolean>>;
}

export const CustomModalMap = ({
  modal,
  width,
  height,
  element,
  setModal,
}: ModalProps) => {
  const disableModal = () => {
    setModal(false);
  };

  return (
    <>
      <Container width={width} height={height}>
        <Wrapper>{element}</Wrapper>
      </Container>
      <Canvas onClick={disableModal} />
    </>
  );
};

const Container = styled.div<{ width: string; height: string }>`
  position: fixed;
  display: flex;
  flex-direction: column;
  left: calc(50vw - ${(props) => props.width}px / 2);
  top: calc(50vh - ${(props) => props.height}px / 2);
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  padding: 8px;
  background-color: white;
  z-index: 1000;
  color: black;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  font-size: 24px;

  @media ${(props) => props.theme.mobile} {
    height: 94%;
    padding: 0px;
  }
`;

const Canvas = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
`;

const Wrapper = styled.div`
  background-color: transparent;
  @media ${(props) => props.theme.mobile} {
    overflow-y: scroll;
  }
`;