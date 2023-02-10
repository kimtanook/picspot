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
  const [sendUser, setSendUser] = useState('');
  const [sendRoom, setSendRoom] = useState('');
  const [sendMessage, setSendMessage] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  const [chat, setChat] = useState<IMessage[]>([]);
  const [toggle, setToggle] = useState(false);

  useEffect((): any => {
    const socket = SocketIOClient.connect(
      process.env.NEXT_PUBLIC_API_URL || 'localhost:3000',
      {
        path: '/api/chat/socket',
      }
    );
    setSocketServer(socket);
    socket.on('connect', () => {
      setSocketId(socket.id);
      setConnected(true);
    });

    socket.on('message', (data: IMessage) => {
      setChat((prev) => [data, ...prev]);
    });

    socket.on('enter', (user) => {
      setChat((prevChat: IMessage[]) => [
        { user: '입장 알림!', message: `${user} joined!` },
        ...prevChat,
      ]);
    });

    socket.on('exit', (user) => {
      setChat((prevChat: IMessage[]) => [
        { user: '퇴장 알림!', message: `${user} left..` },
        ...prevChat,
      ]);
    });

    // socket disconnect on component unmount if exists
    if (socket) return () => socket.disconnect();
  }, []);

  console.log(socketId);
  const sendRoomHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSendRoom(event.target.value);
  };

  const sendMessageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSendMessage(event.target.value);
  };

  const sendNicknameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSendUser(event.target.value);
  };

  const toggleHandler = () => {
    setToggle(true);
  };
  const submitSendRoom = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    socketServer.emit('enter_room', sendRoom, sendUser, toggleHandler);
  };

  const submitSendMessage = async (
    event: React.FormEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (sendMessage) {
      const message: IMessage = {
        room: sendRoom,
        user: sendUser,
        message: sendMessage,
        time: new Date(Date.now() + 9 * 60 * 60 * 1000).toLocaleString(
          'ko-KR',
          {
            timeZone: 'UTC',
          }
        ),
      };
      socketServer.emit('message', message);
      setChat((prev) => [message, ...prev]);
      setSendMessage('');
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
                <User>{chat?.user}</User> <Message>{chat?.message}</Message>{' '}
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
                  value={sendMessage}
                  onChange={sendMessageHandler}
                  autoFocus
                  placeholder={
                    connected ? 'enter your message' : 'Connecting...🕐'
                  }
                />
                <button
                  type="submit"
                  color="primary"
                  onClick={submitSendMessage}
                >
                  Send
                </button>
              </form>
            </div>
          ) : (
            <div>
              <form>
                <input
                  value={sendRoom}
                  onChange={sendRoomHandler}
                  autoFocus
                  placeholder={
                    connected ? 'enter your room' : 'Connecting...🕐'
                  }
                />
                <input
                  value={sendUser}
                  onChange={sendNicknameHandler}
                  autoFocus
                  placeholder={
                    connected ? 'enter your nickname' : 'Connecting...🕐'
                  }
                />
                <button onClick={submitSendRoom}>입장</button>
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
const User = styled.div`
  background-color: black;
  margin: 5px;
  padding: 3px;
  border-radius: 10px;
  color: white;
  width: 100px;
  text-align: center;
`;
const Message = styled.div`
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
