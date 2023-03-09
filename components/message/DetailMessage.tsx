import { checkedMessageData } from '@/api';
import React, { Dispatch, SetStateAction } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';

function DetailMessage({
  item,
  setToggle,
  box,
}: {
  item: SendTakeMessage;
  setToggle: Dispatch<SetStateAction<boolean>>;
  box: string;
}) {
  const queryClient = useQueryClient();
  const { mutate: checkedMutate } = useMutation(checkedMessageData);
  const checkedMessage = () => {
    if (box === '보낸메세지') {
      setToggle(false);
    } else if (item.checked) {
      setToggle(false);
    } else {
      checkedMutate(
        { user: item.takeUser, id: item.id },
        {
          onSuccess: () => {
            if (box === '받은메세지') {
              setTimeout(
                () => queryClient.invalidateQueries('getTakeMessageData'),
                300
              );
            }
            setToggle(false);
          },
        }
      );
    }
  };
  const day = new Date(item.time! + 9 * 60 * 60 * 1000).toLocaleString(
    'ko-KR',
    {
      timeZone: 'UTC',
    }
  );
  return (
    <Wrap>
      <MessageContainer>
        <ItemTitleText>쪽지 보기</ItemTitleText>
        <MessageInfoContainer>
          <ItemNickname>{item.takeUserName}</ItemNickname>
          <ItemDay>{day}</ItemDay>
        </MessageInfoContainer>
        <MessageContent>{item.message}</MessageContent>
        <CloseButton
          onClick={() => {
            checkedMessage();
          }}
        >
          확인
        </CloseButton>
      </MessageContainer>
    </Wrap>
  );
}

export default DetailMessage;

const Wrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
`;
const MessageContainer = styled.div`
  background-color: white;
  width: 370px;
  height: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 20px;
  @media ${(props) => props.theme.mobile} {
    width: 100vw;
    height: 100vh;
    justify-content: flex-start;
  }
`;
const ItemTitleText = styled.div`
  font-size: 20px;
  width: 320px;
  @media ${(props) => props.theme.mobile} {
    margin-top: 5vh;
    font-size: 20px;
    font-weight: 700;
  }
`;
const MessageInfoContainer = styled.div`
  margin: 20px 0px;
  background-color: #f4f4f4;
  border-radius: 10px;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  width: 100%;

  text-align: center;
  aling-self: center;
  @media ${(props) => props.theme.mobile} {
    width: 100%;
  }
`;
const ItemNickname = styled.div`
  font-size: 14px;
  font-weight: 700;
`;

const ItemDay = styled.div`
  font-size: 14px;
  font-weight: 400;
`;
const MessageContent = styled.div`
  padding: 12px;
  width: 320px;
  height: 260px;
  /* border: 1px solid gray; */
  text-align: left;
  color: #5b5b5f;
  margin-bottom: 20px;
`;
const CloseButton = styled.button`
  width: 320px;
  height: 38px;
  border: none;
  background-color: #1882ff;
  color: white;
  cursor: pointer;
`;
