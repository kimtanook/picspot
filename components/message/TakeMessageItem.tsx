import React, { useState } from 'react';
import styled from 'styled-components';
import DetailMessage from './DetailMessage';

function TakeMessageItem({
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
  const day = new Date(item.time! + 9 * 60 * 60 * 1000)
    .toLocaleString('ko-KR', {
      timeZone: 'UTC',
    })
    .slice(0, 10);
  return (
    <div>
      <Wrap>
        {toggle ? (
          <DetailMessage item={item} setToggle={setToggle} box={box} />
        ) : null}
        <SelectWrap>
          <MessageSelect
            type="checkbox"
            value={item.id}
            onChange={() => onClickDeleteMsg(item.id)}
            checked={deleteId?.includes(item.id) ? true : false}
          />
        </SelectWrap>
        <MessageUser>{item.sendUserName}</MessageUser>
        <MessageBody onClick={() => setToggle(!toggle)}>
          {item.message}
        </MessageBody>
        <MessageDay>{day}</MessageDay>
        <MessageStatus>
          {item.checked === true ? (
            <CheckWrap>
              <Checked check={item.checked} />
              <div>읽음</div>
            </CheckWrap>
          ) : (
            <CheckWrap>
              <Checked check={item.checked} />
              <div>읽지않음</div>
            </CheckWrap>
          )}
        </MessageStatus>
      </Wrap>
      <MobileWrap>
        {toggle ? (
          <DetailMessage item={item} setToggle={setToggle} box={box} />
        ) : null}
        <MobileItemTop>
          <MobileTopContainer>
            <SelectWrap>
              <MessageSelect
                type="checkbox"
                value={item.id}
                onChange={() => onClickDeleteMsg(item.id)}
                checked={deleteId?.includes(item.id) ? true : false}
              />
            </SelectWrap>
            <MessageUser>{item.takeUserName}</MessageUser>
          </MobileTopContainer>
          <MobileTopContainer>
            <MessageDay>{day}</MessageDay>
            <MessageStatus>
              {item.checked === true ? (
                <CheckWrap>
                  <Checked check={item.checked} />
                  <div>읽음</div>
                </CheckWrap>
              ) : (
                <CheckWrap>
                  <Checked check={item.checked} />
                  <div>읽지않음</div>
                </CheckWrap>
              )}
            </MessageStatus>
          </MobileTopContainer>
        </MobileItemTop>
        <MessageBody onClick={() => setToggle(!toggle)}>
          {item.message}
        </MessageBody>
      </MobileWrap>
    </div>
  );
}

export default TakeMessageItem;
const Wrap = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  font-size: 14px;
  border-bottom: 2px solid #f4f4f4;
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
`;
const MobileWrap = styled.div`
  display: none;
  @media ${(props) => props.theme.mobile} {
    background-color: #f4f4f4;
    display: inherit;
    height: 90px;
    margin-bottom: 12px;
    border-radius: 12px;
    padding: 14px;
  }
`;
const MobileItemTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media ${(props) => props.theme.mobile} {
    align-self: center;
  }
`;
const MobileTopContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const SelectWrap = styled.div`
  width: 50px;
  @media ${(props) => props.theme.mobile} {
    width: 20px;
  }
`;
const MessageSelect = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    width: 16px;
  }
`;
const MessageUser = styled.div`
  width: 60px;
  overflow: hidden;

  @media ${(props) => props.theme.mobile} {
    align-self: center;
    font-size: 15px;
    font-weight: 600;
    text-align: left;
    padding-left: 10px;
    overflow: hidden;
  }
`;
const MessageBody = styled.div`
  width: 200px;
  max-height: 112px;
  overflow: hidden;
  line-height: 22px;
  text-align: left;
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    width: 300px;
    padding: 5px 0px 0px 29px;
  }
`;
const MessageDay = styled.div`
  width: 70px;
  font-size: 12px;
  @media ${(props) => props.theme.mobile} {
    align-self: center;
    font-size: 14px;
    font-weight: 400;
  }
`;
const MessageStatus = styled.div`
  width: 70px;
  @media ${(props) => props.theme.mobile} {
    align-self: center;
    width: 50px;
  }
`;

const CheckWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  @media ${(props) => props.theme.mobile} {
    align-self: center;
    justify-content: right;
  }
`;
const Checked = styled.div<{ check: boolean | undefined }>`
  background-color: ${(props) =>
    props.check === true ? '#51df5f' : '#FEB819'};
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 3px;
`;
