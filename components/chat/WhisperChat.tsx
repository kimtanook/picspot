import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';

function WhisperChat({
  id,
  user,
  socketServer,
  setWhisperToggle,
  setChat,
}: {
  id: string;
  user: string;
  socketServer: any;
  setWhisperToggle: Dispatch<SetStateAction<boolean>>;
  setChat: Dispatch<SetStateAction<any>>;
}) {
  const [message, setMessage] = useState('');
  const onChangeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };
  const onSubmitWhisper = (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();
    if (message) {
      const messageData: IMessage = {
        user: `${user}의 귓속말`,
        message: message,
        time: new Date(Date.now() + 9 * 60 * 60 * 1000).toLocaleString(
          'ko-KR',
          {
            timeZone: 'UTC',
          }
        ),
        messageType: 'privateMsg',
      };
      socketServer.emit('whisperMessage', id, messageData);
      setChat((prev: string[]) => [messageData, ...prev]);
      setMessage('');
    }
  };
  return (
    <WhisperBox>
      <div>{id}</div>
      <form onSubmit={onSubmitWhisper}>
        <input
          value={message}
          onChange={onChangeMessage}
          placeholder="귓속말 입력 후 엔터"
        />
      </form>
      <button type="button" onClick={() => setWhisperToggle(false)}>
        닫기
      </button>
    </WhisperBox>
  );
}

export default WhisperChat;

const WhisperBox = styled.div`
  background-color: red;
  width: 200px;
  height: 70px;
`;
