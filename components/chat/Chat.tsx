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
                      // socketServer={socketServer}
                      // setChat={setChat}
                    />
                  ))
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    {roomName}방에 입장하셨습니다.
                  </div>
                )}
              </ChatListBox>
              <InfoWrap>
                <RoomUserCount>
                  {roomName}
                  {' 방'} {'|'} {chatUsers ?? '??'}
                  {' 명'}
                </RoomUserCount>
                <form>
                  <MessageInput
                    value={message}
                    onChange={onChangeMessage}
                    autoFocus
                    placeholder={
                      connected ? `${roomName}에게 보내기` : 'Connecting...🕐'
                    }
                  />
                  <SendBtn
                    type="submit"
                    color="primary"
                    onClick={submitMessage}
                  >
                    Send
                  </SendBtn>
                </form>
                <RoomListBtn onClick={onClickRoomList} type="button">
                  방 목록
                </RoomListBtn>
              </InfoWrap>
            </div>
          ) : (
            <RoomSelect>
              {openPublicRooms.length ? (
                <div>
                  <OpenRoom>
                    <div>열린 방</div>
                    <RoomList>
                      {openPublicRooms?.map((item: { room: string }) => (
                        <div key={uuidv4()}>
                          <RoomName value={item.room} onClick={onClickRoom}>
                            {item.room}
                          </RoomName>
                        </div>
                      ))}
                    </RoomList>
                  </OpenRoom>
                  <RoomForm>
                    <UserDisplayName>
                      {authService.currentUser?.displayName}
                    </UserDisplayName>
                    <RoomInput
                      value={roomName}
                      onChange={onChangeRoom}
                      autoFocus
                      placeholder={
                        connected ? '방 만들기 (8자)' : 'Connecting...🕐'
                      }
                      maxLength={8}
                    />
                    <EnterBtn onClick={submitRoomName}>입장</EnterBtn>
                  </RoomForm>
                </div>
              ) : (
                <CloseServer>
                  <NoServerImg src="/no-server.png" />
                  <div>서버연결 없음</div>
                </CloseServer>
              )}
            </RoomSelect>
          )}
        </RoomSelectContainer>
      </div>
    </ComponentContainer>
  );
};

export default Chat;
const ComponentContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-5%, -105%);
  height: 400px;
  background-color: #80a2ff;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ChatListBox = styled.div`
  display: flex;
  flex-direction: column-reverse;
  height: 300px;
  width: 250px;
  overflow-y: scroll;
  background-color: white;
  border-radius: 16px;
`;
const InfoWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const RoomUserCount = styled.div`
  background-color: white;
  margin: 5px;
  width: 200px;
  text-align: center;
  border-radius: 8px;
`;
const MessageInput = styled.input`
  border: none;
  height: 20px;
  border-radius: 8px;
`;
const SendBtn = styled.button`
  background-color: #c9d8ff;
  color: #2c2c2c;
  border: none;
  border-radius: 8px;
  width: 50px;
  height: 20px;
  margin: 5px;
  transition: 0.3s;
  cursor: pointer;
  :hover {
    transition: 0.3s;
    background-color: #4176ff;
    color: white;
  }
`;
const RoomListBtn = styled.button`
  background-color: #c9d8ff;
  color: #2c2c2c;
  border: none;
  border-radius: 8px;
  width: 70px;
  height: 20px;
  margin: 5px;
  transition: 0.3s;
  cursor: pointer;
  :hover {
    transition: 0.3s;
    background-color: white;
  }
`;
const RoomSelectContainer = styled.div`
  padding: 10px;
  height: 120px;
`;
const RoomSelect = styled.div`
  background-color: white;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: 'center';
  text-align: center;
`;
const RoomForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 10px solid #80a2ff;
`;
const OpenRoom = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  width: 250px;
`;
const RoomList = styled.div`
  display: flex;
  flex-direction: column;
  height: 250px;
`;
const RoomInput = styled.input`
  border: none;
  border-radius: 4px;
  background-color: #e1e1e1;
  height: 20px;
  padding-left: 10px;
`;
const CloseServer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 300px;
  width: 250px;
`;
const NoServerImg = styled.img`
  width: 70px;
  height: 70px;
  margin-bottom: 10px;
`;

const RoomName = styled.button`
  background-color: #6790ff;
  color: white;
  border: none;
  border-radius: 16px;
  width: 120px;
  height: 20px;
  margin: 5px;
  text-align: center;
  cursor: pointer;
  transition: 0.5s;
  :hover {
    background-color: #3a5ab1;
  }
`;
const UserDisplayName = styled.div`
  font-weight: 700;
  font-size: 24px;
  color: #4176ff;
  border-radius: 4px;
  width: 100px;
  height: 24px;
  line-height: 24px;
  margin-bottom: 5px;
  margin-top: 5px;
`;
const EnterBtn = styled.button`
  border: none;
  margin: 5px;
  width: 50px;
  height: 24px;
  border-radius: 16px;
  cursor: pointer;
  transition: 0.5s;
  :hover {
    background-color: black;
    color: white;
    transition: 0.5s;
  }
`;
