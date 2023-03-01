import { checkedMessageData, getSendMessage, getTakeMessage } from '@/api';
import { authService } from '@/firebase';
import { uuidv4 } from '@firebase/util';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import SendMessageItem from './SendMessageItem';
import TakeMessageItem from './TakeMessageItem';

function MessageBox() {
  const queryClient = useQueryClient();
  const user = authService.currentUser?.uid;
  const [box, setBox] = useState('받은메세지');
  const { data: takeMsgData } = useQuery(
    ['getTakeMessageData', user],
    getTakeMessage
  );
  const { data: sendMsgData } = useQuery(
    ['getSendMessageData', user],
    getSendMessage
  );
  const checked = takeMsgData?.filter((item) => item.checked === false);
  const { mutate: checkedMutate } = useMutation(checkedMessageData);
  const checkedMessage = () => {
    if (checked?.length === 0) {
      alert('이미 모두 확인하셨습니다');
      return;
    }
    checked?.map((item: SendTakeMessage) => {
      console.log('item : ', item);
      checkedMutate(
        { user: item.takeUser, id: item.id },
        {
          onSuccess: () => {
            setTimeout(
              () => queryClient.invalidateQueries('getTakeMessageData'),
              300
            );
          },
        }
      );
    });
  };

  return (
    <MessageBoxWrap>
      <div>
        <div onClick={() => setBox('받은메세지')}>
          받은메세지<div>미확인메세지{checked?.length ?? null}개</div>
          <button onClick={checkedMessage}>모두확인</button>
        </div>
        <div onClick={() => setBox('보낸메세지')}>보낸메세지</div>
      </div>
      <div>
        {box === '받은메세지' ? (
          <div>
            <div>받은메세지함</div>
            <div>받은메세지목록</div>
            <SendMessageItemList>
              {takeMsgData?.map((item: SendTakeMessage) => (
                <div key={uuidv4()}>
                  <TakeMessageItem item={item} />
                </div>
              ))}
            </SendMessageItemList>
          </div>
        ) : (
          <div>
            <div>보낸메세지함</div>
            <div>보낸메세지목록</div>
            <div>
              {sendMsgData?.map((item: SendTakeMessage) => (
                <div key={uuidv4()}>
                  <SendMessageItem item={item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MessageBoxWrap>
  );
}

export default MessageBox;
const MessageBoxWrap = styled.div`
  background-color: aqua;
  height: 500px;
  width: 500px;
  display: flex;
  justify-content: space-between;
  text-align: center;
`;
const SendMessageItemList = styled.div`
  height: 400px;
  overflow-y: scroll;
`;
