import React from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

function TownSelect({ selectCity, selectTown, onClickSelectTown }: any) {
  // console.log('selectTown : ', selectTown);
  const jejuTown = [
    '제주시 시내',
    '구좌읍',
    '애월읍',
    '우도면',
    '추자면',
    '한경면',
    '한림읍',
    '조천읍',
  ];
  const seogwipoTown = [
    '서귀포시 시내',
    '표선면',
    '대정읍',
    '성산읍',
    '안덕면',
    '남원읍',
  ];
  const allTown = [
    '구좌읍',
    '표선면',
    '대정읍',
    '애월읍',
    '남원읍',
    '성산읍',
    '안덕면',
    '우도면',
    '추자면',
    '한경면',
    '한림읍',
    '조천읍',
  ];
  return (
    <SelectContainer>
      {selectCity === '제주시' ? (
        <SelectTownWrap>
          {jejuTown.map((item: string) => (
            <div key={uuidv4()}>
              <TownBtn
                town={selectTown}
                value={item}
                onClick={onClickSelectTown}
              >
                {item}
              </TownBtn>
            </div>
          ))}
        </SelectTownWrap>
      ) : selectCity === '서귀포시' ? (
        <SelectTownWrap>
          {seogwipoTown.map((item: string) => (
            <div key={uuidv4()}>
              <TownBtn
                town={selectTown}
                value={item}
                onClick={onClickSelectTown}
              >
                {item}
              </TownBtn>
            </div>
          ))}
        </SelectTownWrap>
      ) : (
        <SelectTownWrap>
          {allTown.map((item: string) => (
            <div key={uuidv4()}>
              <TownBtn
                town={selectTown}
                value={item}
                onClick={onClickSelectTown}
              >
                {item}
              </TownBtn>
            </div>
          ))}
        </SelectTownWrap>
      )}
    </SelectContainer>
  );
}

export default TownSelect;

const SelectContainer = styled.div`
  @media ${(props) => props.theme.mobile} {
    height: 30px;
  }
`;
const SelectTownWrap = styled.div`
  margin: auto;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  overflow-x: scroll;
  @media ${(props) => props.theme.mobile} {
    height: 40px;
    overflow-x: scroll;
  }
`;

const TownBtn = styled.button<{ town: string[]; value: string }>`
  background-color: #dcdcdc;
  width: 88px;
  height: 26px;
  margin: 3px;
  border: none;
  border-radius: 52px;
  cursor: pointer;
  border: ${({ value, town }) =>
    town.includes(value) ? '2px solid #FEB819' : 'none'};
`;
