import { authService } from '@/firebase';
import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { addSendedMessage, addSendMessage } from '@/api';
import { useRouter } from 'next/router';

function MessageSend({ setModal }: any) {
  const router = useRouter();
  const profileImg = router.query.userImg as string;
  const userName = router.query.name;
  const userId = router.query.id;
  const queryClient = useQueryClient();
  const { mutate: addMessage } = useMutation(addSendMessage);
  const { mutate: sendedMessage } = useMutation(addSendedMessage);
  const [messageValue, setMessageValue] = useState('');

  const onChangeMessage = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageValue(event?.target.value);
  };

  const onSubmitMessage = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!messageValue) {
      return alert('내용을 입력해주세요');
    }
    const sendMessageData = {
      takeUserImg: profileImg,
      takeUser: userId,
      takeUserName: userName,
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
    <Wrap>
      <CancelButton onClick={() => setModal(false)}>{'<'} 취소</CancelButton>
      <SendWrap>
        <SendUserName>
          <UserProfileImg src={profileImg} alt="userImg" />
          {userName} 님께 쪽지 보내기
        </SendUserName>
        <SendContainer>
          <BodyText>내용</BodyText>
          <SendTextArea
            value={messageValue}
            onChange={onChangeMessage}
            placeholder="비방, 욕설 사용 시 서비스 사용이 제한됩니다."
            maxLength={300}
          />
        </SendContainer>
        <TextCount>
          <Count>{messageValue.length}/300</Count>
        </TextCount>
        <SendButton onClick={onSubmitMessage}>보내기</SendButton>
      </SendWrap>
    </Wrap>
  );
}

export default MessageSend;

const Wrap = styled.div``;
const CancelButton = styled.button`
  background-color: white;
  color: #1882ff;
  border: none;
  font-size: 14px;
  position: absolute;
  top: 5%;
  left: 5%;
`;

const SendWrap = styled.div`
  width: 420px;
  height: 374px;
  display: flex;
  flex-direction: column;
  margin-top: 50px;
`;
const SendUserName = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  background-color: #f4f4f4;
  text-align: center;
  width: 258px;
  height: 68px;
  line-height: 68px;
  margin: 0 auto 0 auto;
  border-radius: 999px;
  font-weight: 700;
`;
const UserProfileImg = styled.img`
  width: 52px;
  width: 52px;
  border-radius: 50%;
  margin-right: 16px;
`;
const SendContainer = styled.div`
  height: 161px;
  width: 420px;
  margin-bottom: 30px;
`;
const BodyText = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
`;
const SendTextArea = styled.textarea`
  padding: 15px;
  background-color: #fbfbfb;
  width: 390px;
  height: 128px;
  resize: none;
  border: none;
  border-bottom: 2px solid #1882ff;
`;
const TextCount = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const Count = styled.div`
  color: #8e8e93;
  font-size: 14px;
`;
const SendButton = styled.button`
  background-color: #1882ff;
  color: white;
  border: none;
  width: 420px;
  height: 48px;
  margin-top: 30px;
`;
