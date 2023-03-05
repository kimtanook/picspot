import { deleteSendMessage } from '@/api';
import { authService } from '@/firebase';
import React, {
  ChangeEvent,
  SetStateAction,
  ChangeEventHandler,
  useState,
} from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import DetailMessage from './DetailMessage';

function SendMessageItem({
  item,
  deleteId,
  onClickDeleteMsg,
  box,
}: {
  item: SendTakeMessage;
  deleteId: string[];
  onClickDeleteMsg: any;
  box: string;
}) {
  const [toggle, setToggle] = useState(false);
  const day = new Date(item.time! + 9 * 60 * 60 * 1000).toLocaleString(
    'ko-KR',
    {
      timeZone: 'UTC',
    }
  );
  return (
    <Wrap>
      {toggle ? (
        <DetailMessage item={item} setToggle={setToggle} box={box} />
      ) : null}
      <MessageSelect
        type="checkbox"
        value={item.id}
        onChange={() => onClickDeleteMsg(item.id)}
        checked={deleteId?.includes(item.id) ? true : false}
      />
      <MessageUser>{item.takeUserName}</MessageUser>
      <MessageBody onClick={() => setToggle(!toggle)}>
        {item.message}
      </MessageBody>
      <MessageDay>{day}</MessageDay>
      <MessageStatus>전송완료</MessageStatus>
    </Wrap>
  );
}

export default SendMessageItem;
const Wrap = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  font-size: 14px;
  border-bottom: 2px solid #f4f4f4;
`;
const MessageSelect = styled.input`
  width: 50px;
`;
const MessageUser = styled.div`
  width: 60px;
`;
const MessageBody = styled.div`
  width: 200px;
  width: 200px;
  max-height: 112px;
  overflow: hidden;
  line-height: 22px;
  cursor: pointer;
`;
const MessageDay = styled.div`
  width: 70px;
  font-size: 12px;
`;
const MessageStatus = styled.div`
  width: 50px;
`;
