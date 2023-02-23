import { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';

const ChatItem = ({
  myName,
  item,
}: // socketServer,
// setChat,
{
  myName: string | null | undefined;
  item: IMessage;
  // socketServer: string;
  // setChat: Dispatch<SetStateAction<IMessage[]>>;
}) => {
  const [userMenuToggle, setUserMenuToggle] = useState(false);
  const onClickUserMenuToggle = () => {
    // if (item.user === myName || item.user === '입장 알림!') {
    //   return;
    // }
    setUserMenuToggle(!userMenuToggle);
  };

  const onClickWhisper = () => {
    setUserMenuToggle(false);
  };
  return (
    <div>
      {userMenuToggle ? (
        <WhisperBox>
          <div>{item.user}</div>
          <div onClick={onClickWhisper}>귓속말</div>
          <div>정보보기</div>
          <div onClick={() => setUserMenuToggle(false)}>닫기</div>
        </WhisperBox>
      ) : null}

      <ChatItemBox>
        <UserName onClick={onClickUserMenuToggle} value={item.id}>
          <div>{item.user === myName ? '나' : item.user}</div>
        </UserName>
        <div>
          <Time> {item.time}</Time>
          <ChatMessage>{item?.message}</ChatMessage>
        </div>
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
  width: 70px;
  text-align: center;
`;
const ChatMessage = styled.div`
  background-color: #d3d3d3;
  margin: 5px;
  padding: 3px;
  border-radius: 10px;
  width: 180px;
  text-align: center;
  font-size: 12px;
`;
const Time = styled.div`
  background-color: #3f3f3f;
  margin: 5px;
  padding: 3px;
  border-radius: 10px;
  color: white;
  width: 180px;
  text-align: center;
  font-size: 8px;
`;
