import { Dispatch, SetStateAction, useEffect } from 'react';
import styled from 'styled-components';

interface ModalProps {
  modal: any;
  width: string;
  height: string;
  element: JSX.Element;
  setModal: Dispatch<SetStateAction<boolean>>;
}

export const CustomModal = ({
  modal,
  width,
  height,
  element,
  setModal,
}: ModalProps) => {
  const disableModal = () => {
    setModal(false);
  };
  // 모달 창이 나왔을때 백그라운드 클릭이 안되게 하고 스크롤도 고정하는 방법
  useEffect(() => {
    console.log('Loading');
    console.log(document);
    document.body.style.cssText = `
  position: fixed; 
  top: -${window.scrollY}px;
  overflow: hidden;
  width: 100%;`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = '';
      window.scrollTo(0, parseInt(scrollY) * -1);
    };
  }, []);

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
  /* padding: 8px; */
  background-color: white;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.05);
  z-index: 9999;
  color: black;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  font-size: 24px;
  border: 1px solid gray;
`;

const Canvas = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
`;

const Wrapper = styled.div`
  background-color: transparent;
  width: 100%;
`;
