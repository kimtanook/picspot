import Modal from '@/components/main/Modal';
import Image from 'next/image';
import { useState } from 'react';
import styled from 'styled-components';
import ModalLogin from '@/components/ModalLogin';
import Seo from '@/components/Seo';
import Chat from '@/components/chat/Chat';

export default function Main() {
  const [isOpenModal, setOpenModal] = useState(false);
  const [chatToggle, setChatToggle] = useState(false);

  const onClickToggleModal = () => {
    setOpenModal(!isOpenModal);
  };

  const onClickChatToggle = () => {
    setChatToggle(!chatToggle);
  };
  const [closeModal, setCloseModal] = useState(false);

  return (
    <>
      <div>
        <Seo title="Home" />
        {closeModal && (
          <ModalLogin closeModal={() => setCloseModal(!closeModal)}>
            <button id="modalCloseBtn" />
          </ModalLogin>
        )}
        <button onClick={() => setCloseModal(!closeModal)}>로그인</button>
      </div>
      {isOpenModal && (
        <Modal onClickToggleModal={onClickToggleModal}>
          <div>children</div>
        </Modal>
      )}

      <input />
      <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
        <Categorys>지역</Categorys>
        <Categorys>작가</Categorys>
        <Categorys>지역</Categorys>
        <Categorys>팔로우</Categorys>
        <Categorys onClick={onClickToggleModal}>게시물 작성</Categorys>
      </div>
      <div></div>
      <div>
        <ImageBox>
          <Image
            // src = {https://i.pinimg.com/564x/c7/e6/ba/c7e6bad3167a4d0188a4e5914e0dcb28.jpg}
            src="/dog.jpeg"
            alt="dog"
            width={200}
            height={200}
            style={{
              margin: '20px',
            }}
          />
          <Image
            // src = {https://i.pinimg.com/564x/c7/e6/ba/c7e6bad3167a4d0188a4e5914e0dcb28.jpg}
            src="/dog.jpeg"
            alt="dog"
            width={200}
            height={200}
            style={{
              margin: '20px',
            }}
          />
          <Image
            // src = {https://i.pinimg.com/564x/c7/e6/ba/c7e6bad3167a4d0188a4e5914e0dcb28.jpg}
            src="/dog.jpeg"
            alt="dog"
            width={200}
            height={200}
            style={{
              margin: '20px',
            }}
          />
          <Image
            // src = {https://i.pinimg.com/564x/c7/e6/ba/c7e6bad3167a4d0188a4e5914e0dcb28.jpg}
            src="/dog.jpeg"
            alt="dog"
            width={200}
            height={200}
            style={{
              margin: '20px',
            }}
          />
          <Image
            // src = {https://i.pinimg.com/564x/c7/e6/ba/c7e6bad3167a4d0188a4e5914e0dcb28.jpg}
            src="/dog.jpeg"
            alt="dog"
            width={200}
            height={200}
            style={{
              margin: '20px',
            }}
          />
        </ImageBox>
        {chatToggle ? <Chat /> : null}
        <ChatToggleBtn onClick={onClickChatToggle}>
          {chatToggle ? '닫기' : '열기'}
        </ChatToggleBtn>
      </div>
    </>
  );
}

const Categorys = styled.button`
  background-color: tomato;
  width: 100px;
  height: 40px;
`;

const ImageBox = styled.div`
  border: tomato 1px solid;
  display: flex;
  flex-direction: row;
`;
const ChatToggleBtn = styled.button`
  position: fixed;
  background-color: aqua;
  left: 90%;
  top: 90%;
  border-radius: 50%;
  border: none;

  width: 50px;
  height: 50px;
`;
