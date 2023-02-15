import { useState } from 'react';
import styled from 'styled-components';
import WhisperChat from './WhisperChat';

const ChatItem = ({
  myName,
  item,
  socketServer,
  setChat,
}: {
  myName: string;
  item: IMessage;
  socketServer: string;
  setChat: any;
}) => {
  const [userMenuToggle, setUserMenuToggle] = useState(false);
  const [whisperToggle, setWhisperToggle] = useState(false);
  const onClickUserMenuToggle = () => {
    if (item.user === myName || item.user === '입장 알림!') {
      return;
    }
    setUserMenuToggle(!userMenuToggle);
  };

  const onClickWhisperToggle = () => {
    setUserMenuToggle(false);
    setWhisperToggle(true);
  };
  return (
    <div>
      {userMenuToggle ? (
        <WhisperBox>
          <div>{item.user}</div>
          <div onClick={onClickWhisperToggle}>귓속말</div>
          <div>정보보기</div>
          <div onClick={() => setUserMenuToggle(false)}>닫기</div>
        </WhisperBox>
      ) : null}
      {whisperToggle ? (
        <WhisperChat
          id={item.id}
          user={myName}
          socketServer={socketServer}
          setWhisperToggle={setWhisperToggle}
          setChat={setChat}
        />
      ) : null}
      <ChatItemBox>
        <UserName onClick={onClickUserMenuToggle} value={item.id}>
          <div>{item.user === myName ? '나' : item.user}</div>
        </UserName>
        <ChatMessage>{item?.message}</ChatMessage>
        <Time> {item.time}</Time>
      </ChatItemBox>
    </div>
  );
};
export default ChatItem;
const WhisperBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 100px;
  background-color: gray;
`;
const ChatItemBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const UserName = styled.button`
  background-color: black;
  margin: 5px;
  padding: 3px;
  border-radius: 10px;
  color: white;
  width: 100px;
  text-align: center;
`;
const ChatMessage = styled.div`
  background-color: #d3d3d3;
  margin: 5px;
  padding: 3px;
  border-radius: 10px;
  width: 200px;
  text-align: center;
  font-size: 12px;
`;
const Time = styled.div`
  background-color: #3f3f3f;
  margin: 5px;
  padding: 3px;
  border-radius: 10px;
  color: white;
  width: 60px;
  text-align: center;
  font-size: 10px;
`;
