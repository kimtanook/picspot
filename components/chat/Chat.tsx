import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

// * Socket.io
import * as SocketIOClient from 'socket.io-client';
import ChatItem from './ChatItem';

const Chat = () => {
  const [socketServer, setSocketServer] = useState<any>(null);
  const [socketId, setSocketId] = useState('');
  const [nickname, setNickname] = useState('');
  const [roomName, setRoomName] = useState('');
  const [openPublicRooms, setOpenPublicRooms] = useState([]);
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
    // 열린 방 보여주기
    socket.on('roomChange', (rooms) => {
      console.log('rooms : ', rooms);
      if (rooms.length === 0) {
        setOpenPublicRooms([]);
      }
      setOpenPublicRooms(rooms);
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
    if (roomName && nickname) {
      // 연결된 socket.io 서버로 데이터 보내기 (emit -> on)
      socketServer.emit(
        'enterRoom',
        roomName,
        nickname,
        socketId,
        toggleHandler
      );
    }
  };

  const submitMessage = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (message) {
      const messageData: IMessage = {
        id: socketId,
        room: roomName,
        user: nickname,
        message: message,
        time: new Date(Date.now() + 9 * 60 * 60 * 1000).toLocaleString(
          'ko-KR',
          {
            timeZone: 'UTC',
          }
        ),
        messageType: 'publicMsg',
      };
      socketServer.emit('message', messageData);
      setChat((prev) => [messageData, ...prev]);
      setMessage('');
    }
  };

  return (
    <ComponentContainer>
      <div>
        <ChatListBox>
          {chat?.length ? (
            chat.map((chat) => (
              <ChatItem
                key={uuidv4()}
                myName={nickname}
                item={chat}
                socketServer={socketServer}
                setChat={setChat}
              />
            ))
          ) : (
            <div>No Chat Messages</div>
          )}
        </ChatListBox>
      </div>
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
              <div>열린 방</div>
              <OpenRoom>
                {openPublicRooms.length ? (
                  <RoomList>
                    {openPublicRooms?.map((item: { room: string }) => (
                      <RoomName key={uuidv4()}>{item.room}</RoomName>
                    ))}
                  </RoomList>
                ) : (
                  '없음'
                )}
              </OpenRoom>
              <form>
                <input
                  value={roomName}
                  onChange={onChangeRoom}
                  autoFocus
                  placeholder={
                    connected ? 'Room name (8 letters) ' : 'Connecting...🕐'
                  }
                  maxLength={8}
                />
                <input
                  value={nickname}
                  onChange={onChangeNickname}
                  autoFocus
                  placeholder={
                    connected ? 'Nickname (12 letters)' : 'Connecting...🕐'
                  }
                  maxLength={12}
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
  left: 80%;
  top: 70%;
  transform: translate(-50%, -50%);
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

const OpenRoom = styled.div`
  display: flex;
  flex-direction: row;
  width: 350px;
  overflow-x: scroll;
`;
const RoomList = styled.div`
  display: flex;
  flex-direction: row;
`;

const RoomName = styled.div`
  background-color: aqua;
  width: 120px;
  margin: 5px;
  text-align: center;
`;
