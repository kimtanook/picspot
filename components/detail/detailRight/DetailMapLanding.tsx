import React, { useState } from 'react';
import styled from 'styled-components';
import { CustomButton } from '@/components/common/CustomButton';
import DetailMaps from './DetailMaps';
import { useRecoilState } from 'recoil';
import { editPlaceAtom } from '@/atom';

const DetailMapLanding = ({}: any) => {
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
        <StyledInput
          placeholder="제주도 지역명을 검색해주세요."
          onChange={onchange}
          value={inputText}
        />

        <CustomButton width="60px" borderRadius="30px" height="35px">
          검색
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

const StyledForm = styled.form`
  position: absolute;
  bottom: 10px;
  z-index: 999;
`;

const StyledInput = styled.input`
  padding: 10px;
  width: 400px;
  border-radius: 16px;
  border: 0.5px solid black;
`;
