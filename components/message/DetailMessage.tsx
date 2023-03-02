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
    if (item.checked) {
      setToggle(false);
    } else {
      checkedMutate(
        { user: item.takeUser, id: item.id },
        {
          onSuccess: () => {
            setTimeout(() => {
              if (box === '받은메세지') {
                queryClient.invalidateQueries('getTakeMessageData');
              } else {
                queryClient.invalidateQueries('getSendMessageData');
              }
            }, 300);
          },
        }
      );
      setTimeout(() => setToggle(false), 300);
    }
  };

  return (
    <Wrap>
      <div>내용</div>
      <div>{item.message}</div>
      <div
        onClick={() => {
          checkedMessage();
        }}
      >
        닫기
      </div>
    </Wrap>
  );
}

export default DetailMessage;

const Wrap = styled.div`
  background-color: aqua;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  max-height: 300px;
`;
