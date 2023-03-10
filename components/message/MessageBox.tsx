import {
  deleteSendMessage,
  deleteTakeMessage,
  getSendMessage,
  getTakeMessage,
} from '@/api';
import { messageBoxToggle } from '@/atom';
import { authService } from '@/firebase';
import { uuidv4 } from '@firebase/util';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useMediaQuery } from 'react-responsive';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import SendMessageItem from './SendMessageItem';
import TakeMessageItem from './TakeMessageItem';

function MessageBox() {
  const isMobile = useMediaQuery({ maxWidth: 823 });
  const isPc = useMediaQuery({ minWidth: 824 });
  const queryClient = useQueryClient();
  const user = authService.currentUser?.uid;
  const [msgToggle, setMsgToggle] = useRecoilState(messageBoxToggle);
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
    <Wrap>
      <MessageBoxWrap>
        {isPc && (
          <CloseButton onClick={() => setMsgToggle(false)}>
            {' '}
            〈 닫기
          </CloseButton>
        )}
        {isMobile && (
          <ProfileEditCancleBtn
            onClick={() => setMsgToggle(false)}
            src={'/Back-point.png'}
          />
        )}

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
    </Wrap>
  );
}

export default MessageBox;
const Wrap = styled.div`
  background-color: #0000005c;
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
`;
const MessageBoxWrap = styled.div`
  width: 454px;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 16px;
  background-color: white;
  @media ${(props) => props.theme.mobile} {
    width: 100vw;
    max-width: 400px;
    height: 100vh;
    justify-content: normal;
  }
`;
const CloseButton = styled.button`
  position: absolute;
  top: 5%;
  border: none;
  background-color: white;
  color: #1882ff;
`;

const ProfileEditCancleBtn = styled.img`
  width: 12px;
  height: 28px;
  position: absolute;
  top: 6.6%;
  left: 7%;
  border: none;
`;

const MessageBoxTitle = styled.div`
  margin: 30px;
  @media ${(props) => props.theme.mobile} {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 0px;
  }
`;
const MessageToggleBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media ${(props) => props.theme.mobile} {
    width: 90vw;
    height: 30px;
    margin: 40px 0px 20px 0px;
  }
`;
const TakeSendButtonBox = styled.div`
  display: flex;
  flex-direction: row;
`;
const TakeBoxImg = styled.img`
  width: 95px;
  height: 32px;
  margin-left: 5px;
  cursor: pointer;
`;
const SelectDeleteButton = styled.button`
  background-color: #8e8e93;
  font-size: 10px;
  color: white;
  border: none;
  border-radius: 10px;
  width: 80px;
  height: 30px;
  cursor: pointer;
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
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
`;

const MessageSelect = styled.div`
  width: 50px;
`;
const MessageUser = styled.div`
  width: 60px;
  @media ${(props) => props.theme.mobile} {
    align-self: center;
  }
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
