import React, { useState, useEffect, ChangeEvent } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

// * Socket.io
import * as SocketIOClient from 'socket.io-client';
import ChatItem from './ChatItem';
import { authService } from '@/firebase';

const Chat = () => {
  const [socketServer, setSocketServer] = useState<any>(null);
  const [socketId, setSocketId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [openPublicRooms, setOpenPublicRooms] = useState([]);
  const [chatUsers, setChatUsers] = useState();
  const [message, setMessage] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  const [chat, setChat] = useState<IMessage[]>([]);
  const [toggle, setToggle] = useState(false);

  const onChangeRoom = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const onChangeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const toggleHandler = () => {
    setToggle(true);
  };
  const onClickRoom = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (authService.currentUser?.displayName) {
      setRoomName(event.currentTarget.value);
      // 연결된 socket.io 서버로 데이터 보내기 (emit -> on)
      socketServer.emit(
        'enterRoom',
        event.currentTarget.value,
        authService.currentUser?.displayName,
        socketId,
        toggleHandler
      );
    } else {
      alert('닉네임을 정하셔야합니다.');
    }
  };
  const submitRoomName = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (
      !openPublicRooms.map((item: { room: string }) => item.room === roomName)
    ) {
      return alert('이미 존재하는 방입니다.');
    }
    if (roomName && authService.currentUser?.displayName) {
      // 연결된 socket.io 서버로 데이터 보내기 (emit -> on)
      socketServer.emit(
        'enterRoom',
        roomName,
        authService.currentUser?.displayName,
        socketId,
        toggleHandler
      );
    } else {
      alert('닉네임을 정하셔야합니다.');
    }
  };

  const submitMessage = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (message) {
      const messageData: IMessage = {
        id: socketId,
        room: roomName,
        user: authService.currentUser?.displayName,
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
  const onClickRoomList = () => {
    setChat([]);
    socketServer.emit('leaveRoom', roomName, socketId);
    setRoomName('');
    setToggle(!toggle);
  };

  useEffect((): any => {
    // socket.io 연결
    const socket = SocketIOClient.connect('localhost:3000');
    // useEffect 밖에서도 사용할 수 있게 state에 저장
    setSocketServer(socket);

    // socket.io에 연결되면 socket id를 state에 저장
    socket.on('connect', () => {
      setSocketId(socket.id);
      setConnected(true);
    });

    // message 데이터 받기 (on <- emit)
    socket.on('message', (data: IMessage) => {
      setChat((prev: IMessage[]) => [data, ...prev]);
    });

    // 방 입장 데이터 받기 (on <- emit)
    socket.on('enter', (user, countRoomUser) => {
      setChat((prevChat: IMessage[]) => [
        {
          user: '입장 알림!',
          message: `${user} joined!`,
          time: new Date(Date.now() + 9 * 60 * 60 * 1000).toLocaleString(
            'ko-KR',
            {
              timeZone: 'UTC',
            }
          ),
        },
        ...prevChat,
      ]);
      setChatUsers(countRoomUser);
    });
    // 열린 방, 방 접속자 보여주기
    socket.on('roomChange', (rooms) => {
      if (rooms.length === 0) {
        setOpenPublicRooms([]);
      }
      setOpenPublicRooms(rooms);
    });
    // 방 퇴장 데이터 받기 (on <- emit)
    socket.on('exit', (user, countRoomUser) => {
      setChat((prevChat: IMessage[]) => [
        {
          user: '퇴장 알림!',
          message: `${user} left..`,
          time: new Date(Date.now() + 9 * 60 * 60 * 1000).toLocaleString(
            'ko-KR',
            {
              timeZone: 'UTC',
            }
          ),
        },
        ...prevChat,
      ]);
      setChatUsers(countRoomUser);
    });
    // useEffect clean 함수
    if (socket) return () => socket.disconnect();
  }, []);
  console.log('chatUsers : ', chatUsers);
  return (
    <ComponentContainer>
      <div>
        <RoomSelectContainer>
          {toggle ? (
            <div>
              <ChatListBox>
                {chat?.length ? (
                  chat.map((chat) => (
                    <ChatItem
                      key={uuidv4()}
                      myName={authService.currentUser?.displayName}
                      item={chat}
                      socketServer={socketServer}
                      setChat={setChat}
                    />
                  ))
                ) : (
                  <div>No Chat Messages</div>
                )}
              </ChatListBox>
              <div>현재 방</div>
              <div>
                {roomName} / {chatUsers}명
              </div>
              {/* <select>
                <option>상대</option>
                <option value={roomName} id={roomName}>
                  {roomName}
                </option>
                {chatUsers?.map((item: any) => (
                  <option key={uuidv4()} value={item.id}>
                    {socketId === item.id ? '나' : item.user}
                  </option>
                ))}
              </select> */}
              <form>
                <input
                  value={message}
                  onChange={onChangeMessage}
                  autoFocus
                  placeholder={
                    connected ? `${roomName}에게 보내기` : 'Connecting...🕐'
                  }
                />
                <button type="submit" color="primary" onClick={submitMessage}>
                  Send
                </button>
              </form>
              <button onClick={onClickRoomList} type="button">
                방 목록
              </button>
            </div>
          ) : (
            <RoomSelect>
              <div>열린 방</div>
              <OpenRoom>
                {openPublicRooms.length ? (
                  <RoomList>
                    {openPublicRooms?.map((item: { room: string }) => (
                      <div key={uuidv4()}>
                        <RoomName value={item.room} onClick={onClickRoom}>
                          {item.room}
                        </RoomName>
                      </div>
                    ))}
                  </RoomList>
                ) : (
                  '없음'
                )}
              </OpenRoom>
              <RoomForm>
                <div>{authService.currentUser?.displayName}</div>
                <input
                  value={roomName}
                  onChange={onChangeRoom}
                  autoFocus
                  placeholder={
                    connected ? '방 만들기 (8자)' : 'Connecting...🕐'
                  }
                  maxLength={8}
                />
                <button onClick={submitRoomName}>입장</button>
              </RoomForm>
            </RoomSelect>
          )}
        </RoomSelectContainer>
      </div>
    </ComponentContainer>
  );
};

export default Chat;
const ComponentContainer = styled.div`
  height: 400px;
  background-color: #00ff26;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ChatListBox = styled.div`
  display: flex;
  flex-direction: column-reverse;
  height: 300px;
  overflow-y: scroll;
`;
const RoomSelectContainer = styled.div`
  padding: 5px;
  height: 120px;
`;
const RoomSelect = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: 'center';
  text-align: center;
`;
const RoomForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const OpenRoom = styled.div`
  display: flex;
  overflow-y: scroll;
  width: 250px;
`;
const RoomList = styled.div`
  display: flex;
  flex-direction: column;
  height: 300px;
`;

const RoomName = styled.button`
  background-color: #bebebe;
  width: 120px;
  margin: 5px;
  text-align: center;
`;
