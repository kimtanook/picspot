import { authService } from '@/firebase';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import styled from 'styled-components';
import { addSendedMessage, addSendMessage } from '@/api';
import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';

interface Props {
  setModal: (value: boolean) => void;
}

function MessageSend({ setModal }: Props) {
  const router = useRouter();
  const profileImg = router.query.userImg as string;
  const userName = router.query.name;
  const userId = router.query.id;

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
        setMessageValue('');
      },
    });
    sendedMessage(sendMessageData, {
      onSuccess: () => {
        setMessageValue('');
      },
    });
    alert('전송완료!');
    setModal(false);
  };
  const isMobile = useMediaQuery({ maxWidth: 823 });
  const isPc = useMediaQuery({ minWidth: 824 });
  return (
    <Wrap>
      <SendWrap>
        <div>
          {isPc && (
            <CancelButton onClick={() => setModal(false)}>〈 취소</CancelButton>
          )}
          {isMobile && (
            <CancleBtn
              onClick={() => setModal(false)}
              src={'/Back-point.png'}
            />
          )}

          {isMobile && <SendTitle>쪽지 보내기</SendTitle>}
        </div>
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

const Wrap = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #00000061;
  width: 100vw;
  height: 100vh;
`;
const CancelButton = styled.button`
  background-color: white;
  color: #1882ff;
  border: none;
  font-size: 14px;
  position: absolute;
  top: 5%;
  left: 5%;
`;
const CancleBtn = styled.img`
  width: 12px;
  height: 28px;
  position: absolute;
  top: 5%;
  left: 7%;
  border: none;
`;

const SendTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  position: absolute;
  top: 5%;
  left: 40vw;
`;

const SendWrap = styled.div`
  background-color: white;
  width: 524px;
  height: 467px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  @media ${(props) => props.theme.mobile} {
    width: 100vw;
    height: 100vh;
    justify-content: center;
  }
`;
const SendUserName = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  background-color: #f4f4f4;
  text-align: center;
  width: 60%;
  height: 68px;
  line-height: 68px;
  margin: 0 auto 0 auto;
  border-radius: 999px;
  font-weight: 700;
  @media ${(props) => props.theme.mobile} {
    width: 70vw;
    background-color: white;
  }
`;
const UserProfileImg = styled.img`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  margin-right: 16px;
  @media ${(props) => props.theme.mobile} {
    width: 50px;
    height: 50px;
  }
`;
const SendContainer = styled.div`
  height: 161px;
  width: 420px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media ${(props) => props.theme.mobile} {
    width: 85vw;
    margin-bottom: 0px;
    height: 161px;
    justify-content: end;
    margin-top: 20px;
  }
`;
const BodyText = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
  @media ${(props) => props.theme.mobile} {
    display: none;
    margin-bottom: 0px;
  }
`;
const SendTextArea = styled.textarea`
  padding: 15px;
  background-color: #fbfbfb;
  height: 128px;
  resize: none;
  border: none;
  border-bottom: 2px solid #1882ff;
`;
const TextCount = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 420px;
  @media ${(props) => props.theme.mobile} {
    width: 85vw;
    margin-top: 5px;
  }
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
  @media ${(props) => props.theme.mobile} {
    width: 85vw;
  }
`;
