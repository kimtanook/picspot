import { authService } from '@/firebase';
import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { addSendedMessage, addSendMessage } from '@/api';
import { useRouter } from 'next/router';

function MessageSend() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: addMessage } = useMutation(addSendMessage);
  const { mutate: sendedMessage } = useMutation(addSendedMessage);
  const [messageValue, setMessageValue] = useState('');

  const onChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
    setMessageValue(event?.target.value);
  };

  const onSubmitMessage = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const sendMessageData = {
      takeUser: router.query.id,
      takeUserName: router.query.name,
      sendUser: authService.currentUser?.uid,
      sendUserName: authService.currentUser?.displayName,
      message: messageValue,
      time: Date.now(),
      checked: false,
    };
    addMessage(sendMessageData, {
      onSuccess: () => {
        setTimeout(
          () => queryClient.invalidateQueries('getTakeMessageData'),
          300
        );
        setMessageValue('');
      },
    });
    sendedMessage(sendMessageData, {
      onSuccess: () => {
        setTimeout(
          () => queryClient.invalidateQueries('getSendMessageData'),
          300
        );
        setMessageValue('');
      },
    });
  };
  return (
    <SendContainer>
      <div>{authService.currentUser?.displayName}</div>
      <input value={messageValue} onChange={onChangeMessage} />
      <button onClick={onSubmitMessage}>보내기</button>
    </SendContainer>
  );
}

export default MessageSend;
const SendContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
