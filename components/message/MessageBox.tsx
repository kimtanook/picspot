import {
  deleteSendMessage,
  deleteTakeMessage,
  getSendMessage,
  getTakeMessage,
} from '@/api';
import { authService } from '@/firebase';
import { uuidv4 } from '@firebase/util';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import DetailMessage from './DetailMessage';
import SendMessageItem from './SendMessageItem';
import TakeMessageItem from './TakeMessageItem';

function MessageBox() {
  const queryClient = useQueryClient();
  const user = authService.currentUser?.uid;
  const [box, setBox] = useState('받은메세지');
  const [deleteId, setDeleteId] = useState(['']);
  const [deleteType, setDeleteType] = useState('takeType');
  const { data: takeMsgData } = useQuery(
    ['getTakeMessageData', user],
    getTakeMessage
  );
  const { data: sendMsgData } = useQuery(
    ['getSendMessageData', user],
    getSendMessage
  );
  const { mutate: deleteTakeMutate } = useMutation(deleteTakeMessage);
  const { mutate: deleteSendMutate } = useMutation(deleteSendMessage);

  const onClickDeleteMsg = (id: string) => {
    if (deleteId.includes(id)) {
      setDeleteId(deleteId.filter((item: string) => !item?.includes(id)));
    } else {
      setDeleteId((prev) => [...prev, id]);
    }
  };
  const deleteMessage = () => {
    if (deleteType === 'sendType') {
      deleteId.map((item: string) => {
        if (item) {
          deleteSendMutate(
            { uid: user, id: item },
            {
              onSuccess: () => {
                setTimeout(
                  () => queryClient.invalidateQueries('getSendMessageData'),
                  300
                );
              },
            }
          );
        }
      });
      setTimeout(() => setDeleteId(['']), 500);
    } else {
      deleteId.map((item: string) => {
        if (item) {
          deleteTakeMutate(
            { uid: user, id: item },
            {
              onSuccess: () => {
                setTimeout(
                  () => queryClient.invalidateQueries('getTakeMessageData'),
                  300
                );
              },
            }
          );
        }
      });
    }
    setTimeout(() => setDeleteId(['']), 500);
  };
  return (
    <MessageBoxWrap>
      <MessageBoxTitle>쪽지함</MessageBoxTitle>
      <MessageToggleBox>
        <TakeSendButtonBox>
          <div
            onClick={() => {
              setBox('받은메세지');
              setDeleteType('takeType');
            }}
          >
            {box === '받은메세지' ? (
              <TakeBoxImg src="/message/take-box-on.png" />
            ) : (
              <TakeBoxImg src="/message/take-box-off.png" />
            )}
          </div>
          <div
            onClick={() => {
              setBox('보낸메세지');
              setDeleteType('sendType');
            }}
          >
            {box === '보낸메세지' ? (
              <TakeBoxImg src="/message/send-box-on.png" />
            ) : (
              <TakeBoxImg src="/message/send-box-off.png" />
            )}
          </div>
        </TakeSendButtonBox>
        <SelectDeleteButton onClick={deleteMessage}>
          선택항목 삭제
        </SelectDeleteButton>
      </MessageToggleBox>
      <div>
        <CategoryList>
          <MessageSelect>선택</MessageSelect>
          <MessageUser>
            {box === '받은메세지' ? '보낸사람' : '받는사람'}
          </MessageUser>
          <MessageBody>내용</MessageBody>
          <MessageDay>날짜</MessageDay>
          <MessageStatus>상태</MessageStatus>
        </CategoryList>
        <MessageList>
          {box === '받은메세지' ? (
            <SendMessageItemList>
              {takeMsgData?.map((item: SendTakeMessage) => (
                <div key={uuidv4()}>
                  <TakeMessageItem
                    item={item}
                    deleteId={deleteId}
                    onClickDeleteMsg={onClickDeleteMsg}
                    box={box}
                  />
                </div>
              ))}
            </SendMessageItemList>
          ) : (
            <SendMessageItemList>
              {sendMsgData?.map((item: SendTakeMessage) => (
                <div key={uuidv4()}>
                  <SendMessageItem
                    item={item}
                    deleteId={deleteId}
                    onClickDeleteMsg={onClickDeleteMsg}
                    box={box}
                  />
                </div>
              ))}
            </SendMessageItemList>
          )}
        </MessageList>
      </div>
    </MessageBoxWrap>
  );
}

export default MessageBox;
const MessageBoxWrap = styled.div`
  width: 454px;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
`;
const MessageBoxTitle = styled.div`
  margin: 30px;
`;
const MessageToggleBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const TakeSendButtonBox = styled.div`
  display: flex;
  flex-direction: row;
`;
const TakeBoxImg = styled.img`
  width: 95px;
  height: 32px;
  margin-left: 5px;
`;
const SelectDeleteButton = styled.button`
  background-color: #8e8e93;
  font-size: 10px;
  color: white;
  border: none;
  border-radius: 10px;
  width: 80px;
  height: 30px;
`;
const CategoryList = styled.div`
  background-color: #f4f4f4;
  color: #8e8e93;
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  margin: auto;
  height: 36px;
  font-size: 14px;
`;

const MessageSelect = styled.div`
  width: 50px;
`;
const MessageUser = styled.div`
  width: 60px;
`;
const MessageBody = styled.div`
  width: 200px;
`;
const MessageDay = styled.div`
  width: 70px;
`;
const MessageStatus = styled.div`
  width: 50px;
`;
const MessageList = styled.div`
  height: 400px;
`;
const SendMessageItemList = styled.div`
  height: 300px;
  overflow-y: scroll;
`;
