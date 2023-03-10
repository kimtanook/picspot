import React, { useState } from 'react';
import styled from 'styled-components';
// import { CustomButton } from '@/components/common/CustomButton';
import DetailMaps from './DetailMaps';
import { useRecoilState } from 'recoil';
import { editPlaceAtom } from '@/atom';

const DetailMapLanding = () => {
  //! global state
  const [editPlace, setEditPlace] = useRecoilState(editPlaceAtom);

  //! component state
  const [editSearchCategory, setEditSearchCategory]: any = useState('');

  const [inputText, setInputText] = useState('');
  const [infoDiv, setInfoDiv] = useState('');
  const onchange = (e: any) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setEditPlace(inputText);
    setInputText('');
  };

  return (
    <StyleContainer>
      <StyledForm onSubmit={handleSubmit}>
        <>
          <StyledInput
            placeholder="제주도 지역명을 검색해주세요!"
            color="#D9D9D9"
            onChange={onchange}
            value={inputText}
          />
          <Find src="/find-blue.png" alt="image" />
        </>
        <CustomButton>
          <Reset src="/reset-blue.png" alt="image" />
        </CustomButton>
      </StyledForm>

      <DetailMaps
        searchPlace={editPlace ? editPlace : editSearchCategory}
        setInfoDiv={setInfoDiv}
      />
    </StyleContainer>
  );
};

export default DetailMapLanding;

const StyleContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 230px;
`;

const Find = styled.img`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 30%;
  left: 220px;
  background-color: #f4f4f4;
`;

const CustomButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50px;
  border: 2px solid #1882ff;
  background-color: #f4f4f4;

  margin-left: 10px;
`;
const Reset = styled.img`
  width: 16px;
  height: 16px;
  display: flex;
  flex-direction: center;
  align-items: center;
`;
const StyledForm = styled.form`
  position: absolute;
  bottom: 10px;
  z-index: 999;
`;

const StyledInput = styled.input`
  padding: 10px;
  width: 250px;
  height: 30px;
  border-radius: 20px;
  border: 2px solid #1882ff;
  background-color: #f4f4f4;
  color: black;
  font-size: 14px;
  font-family: 'Noto Sans CJK KR';
  :focus-visible {
    outline: none;
  }
`;
