import { deleteTakeMessage } from '@/api';
import { authService } from '@/firebase';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';

function TakeMessageItem({ item }: { item: SendTakeMessage }) {
  const user = authService.currentUser?.uid;
  const queryClient = useQueryClient();
  const { mutate: sendMessage } = useMutation(deleteTakeMessage);
  const deleteMessage = () => {
    sendMessage(
      { uid: user, id: item.id },
      {
        onSuccess: () => {
          setTimeout(
            () => queryClient.invalidateQueries('getTakeMessageData'),
            300
          );
        },
      }
    );
  };
  return (
    <div>
      <div>받는사람 : {item.sendUserName}</div>
      <div>내용 : {item.message}</div>
      <div>시간 : {item.time}</div>
      <div>id: {item.id}</div>
      <div>checked: {item.checked === true ? 'true' : 'false'}</div>
      <button onClick={deleteMessage}>삭제</button>
    </div>
  );
}

export default TakeMessageItem;
