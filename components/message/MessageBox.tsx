import { getSendMessage, getTakeMessage } from '@/api';
import { authService } from '@/firebase';
import { uuidv4 } from '@firebase/util';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import SendMessageItem from './SendMessageItem';
import TakeMessageItem from './TakeMessageItem';

function MessageBox() {
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
  return (
    <MessageBoxWrap>
      <div>
        <div onClick={() => setBox('받은메세지')}>받은메세지</div>
        <div onClick={() => setBox('보낸메세지')}>보낸메세지</div>
      </div>
      <div>
        {box === '받은메세지' ? (
          <div>
            <div>받은메세지함</div>
            <div>받은메세지목록</div>
            <div>
              {takeMsgData?.map((item: any) => (
                <div key={uuidv4()}>
                  <TakeMessageItem item={item} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div>보낸메세지함</div>
            <div>보낸메세지목록</div>
            <div>
              {sendMsgData?.map((item: any) => (
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
  width: 500px;
  display: flex;
  justify-content: space-between;
  text-align: center;
`;
