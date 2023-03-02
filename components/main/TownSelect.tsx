import React from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

function TownSelect({
  selectCity,
  selectTown,
  onClickSelectTown,
  onChangeSelectTown,
}: any) {
  console.log('selectTown : ', selectTown);
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
      <WebSelect>
        {selectCity === '제주시' ? (
          <div>
            {jejuTown.map((item: string) => (
              <TownBtn
                key={uuidv4()}
                town={selectTown}
                value={item}
                onClick={onClickSelectTown}
              >
                {item}
              </TownBtn>
            ))}
          </div>
        ) : selectCity === '서귀포시' ? (
          <div>
            {seogwipoTown.map((item: string) => (
              <TownBtn
                key={uuidv4()}
                town={selectTown}
                value={item}
                onClick={onClickSelectTown}
              >
                {item}
              </TownBtn>
            ))}
          </div>
        ) : (
          <div>
            {allTown.map((item: string) => (
              <TownBtn
                key={uuidv4()}
                town={selectTown}
                value={item}
                onClick={onClickSelectTown}
              >
                {item}
              </TownBtn>
            ))}
          </div>
        )}
      </WebSelect>
      <MobileSelect>
        {selectCity === '제주시' ? (
          <Select onChange={onChangeSelectTown} value={selectTown}>
            <option value="">제주시 전체</option>
            {jejuTown.map((item: string) => (
              <TownOption key={uuidv4()} value={item}>
                {item}
              </TownOption>
            ))}
          </Select>
        ) : selectCity === '서귀포시' ? (
          <Select onChange={onChangeSelectTown} value={selectTown}>
            <option value="">서귀포시 전체</option>
            {seogwipoTown.map((item: string) => (
              <TownOption key={uuidv4()} value={item}>
                {item}
              </TownOption>
            ))}
          </Select>
        ) : (
          <Select onChange={onChangeSelectTown} value={selectTown}>
            <option value="">제주도 전체</option>
            {allTown.map((item: string) => (
              <TownOption key={uuidv4()} value={item}>
                {item}
              </TownOption>
            ))}
          </Select>
        )}
      </MobileSelect>
    </SelectContainer>
  );
}

export default TownSelect;

const SelectContainer = styled.div`
  @media ${(props) => props.theme.mobile} {
  }
`;

const WebSelect = styled.div`
  margin: auto;
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
`;
const Select = styled.select`
  border: none;
  background-color: inherit;
`;
const MobileSelect = styled.div`
  display: none;
  @media ${(props) => props.theme.mobile} {
    display: inherit;
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
const TownOption = styled.option``;
