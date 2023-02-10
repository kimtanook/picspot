import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// * Socket.io
import * as SocketIOClient from 'socket.io-client';

interface IMessage {
  user?: string;
  message?: string;
  room?: string;
  time?: string;
}

const Chat = () => {
  const [socketServer, setSocketServer] = useState<any>(null);
  const [socketId, setSocketId] = useState('');
  const [nickname, setNickname] = useState('');
  const [roomName, setRoomName] = useState('');
  const [message, setMessage] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  const [chat, setChat] = useState<IMessage[]>([]);
  const [toggle, setToggle] = useState(false);

  useEffect((): any => {
    // socket.io 연결
    const socket = SocketIOClient.connect({
      path: '/api/chat/socket',
    });
    // useEffect 밖에서도 사용할 수 있게 state에 저장
    setSocketServer(socket);

    // socket.io에 연결되면 socket id를 state에 저장
    socket.on('connect', () => {
      setSocketId(socket.id);
      setConnected(true);
    });

    // message 데이터 받기 (on <- emit)
    socket.on('message', (data: IMessage) => {
      setChat((prev) => [data, ...prev]);
    });

    // 방 입장 데이터 받기 (on <- emit)
    socket.on('enter', (user) => {
      setChat((prevChat: IMessage[]) => [
        { user: '입장 알림!', message: `${user} joined!` },
        ...prevChat,
      ]);
    });
    // 방 퇴장 데이터 받기 (on <- emit)
    socket.on('exit', (user) => {
      setChat((prevChat: IMessage[]) => [
        { user: '퇴장 알림!', message: `${user} left..` },
        ...prevChat,
      ]);
    });

    // useEffect clean 함수
    if (socket) return () => socket.disconnect();
  }, []);

  const onChangeRoom = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const onChangeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const onChangeNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const toggleHandler = () => {
    setToggle(true);
  };
  const submitRoomName = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // 연결된 socket.io 서버로 데이터 보내기 (emit -> on)
    socketServer.emit('enter_room', roomName, nickname, toggleHandler);
  };

  const submitMessage = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (message) {
      const messageData: IMessage = {
        room: roomName,
        user: nickname,
        message: message,
        time: new Date(Date.now() + 9 * 60 * 60 * 1000).toLocaleString(
          'ko-KR',
          {
            timeZone: 'UTC',
          }
        ),
      };
      socketServer.emit('message', messageData);
      setChat((prev) => [messageData, ...prev]);
      setMessage('');
    }
  };

  return (
    <ComponentContainer>
      <div>
        {/* 채팅 메시지 출력 영역 */}
        <ChatListBox>
          {chat?.length ? (
            chat.map((chat, index) => (
              <ChatItemBox key={index}>
                <UserName>{chat?.user}</UserName>
                <ChatMessage>{chat?.message}</ChatMessage>
                <Time> {chat?.time}</Time>
              </ChatItemBox>
            ))
          ) : (
            <div>No Chat Messages</div>
          )}
        </ChatListBox>
      </div>
      {/* 채팅 메시지 입력 영역 */}
      <div>
        <div>
          {toggle ? (
            <div>
              <form>
                <input
                  value={message}
                  onChange={onChangeMessage}
                  autoFocus
                  placeholder={
                    connected ? 'enter your message' : 'Connecting...🕐'
                  }
                />
                <button type="submit" color="primary" onClick={submitMessage}>
                  Send
                </button>
              </form>
            </div>
          ) : (
            <div>
              <form>
                <input
                  value={roomName}
                  onChange={onChangeRoom}
                  autoFocus
                  placeholder={
                    connected ? 'enter your room' : 'Connecting...🕐'
                  }
                />
                <input
                  value={nickname}
                  onChange={onChangeNickname}
                  autoFocus
                  placeholder={
                    connected ? 'enter your nickname' : 'Connecting...🕐'
                  }
                />
                <button onClick={submitRoomName}>입장</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </ComponentContainer>
  );
};

export default Chat;
const ComponentContainer = styled.div`
  position: fixed;
  background-color: aqua;
  left: 60%;
  top: 50%;
  height: 300px;
  width: 350px;
`;
const ChatListBox = styled.div`
  display: flex;
  flex-direction: column-reverse;
  height: 300px;
  width: 350px;
  border: 1px solid black;
  overflow-y: scroll;
`;
const ChatItemBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const UserName = styled.div`
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
