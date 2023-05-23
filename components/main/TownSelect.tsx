import { townArray } from '@/atom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

function TownSelect({ selectCity, selectTown, onClickSelectTown }: any) {
  const [selectTownArr, setSelectArrTown] = useRecoilState(townArray);
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
      <SelectTownWrap>
        <TownResetWrap onClick={() => setSelectArrTown([])}>
          <TownReset src="/town-reset.png" />
        </TownResetWrap>
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
      </SelectTownWrap>
    </SelectContainer>
  );
}

export default TownSelect;

const SelectContainer = styled.div`
  width: 100vw;
  display: flex;
  @media ${(props) => props.theme.mobile} {
    height: 30px;
  }
`;
const TownResetWrap = styled.div`
  display: flex;
  align-items: center;
  width: 50px;
  height: 40px;
  margin-right: 10px;
  margin-left: 10px;
  cursor: pointer;
`;
const TownReset = styled.img`
  width: 28px;
  height: 28px;
`;
const SelectTownWrap = styled.div`
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  overflow-x: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  @media ${(props) => props.theme.mobile} {
    overflow-x: scroll;
    justify-content: inherit;
    align-items: inherit;
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
  background-color: ${({ value, town }) =>
    town.includes(value) ? '#FEB819' : 'none'};
  color: ${({ value, town }) => (town.includes(value) ? 'white' : 'none')};
  :hover {
    border: 2px solid #feb819;
  }
`;
