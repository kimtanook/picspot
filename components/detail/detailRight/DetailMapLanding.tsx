import React, { useState } from 'react';
import styled from 'styled-components';
import { CustomButton } from '@/components/common/CustomButton';
import DetailMaps from './DetailMaps';

const DetailMapLanding = ({
  searchCategory,
  saveLatLng,
  setSaveLatLng,
  saveAddress,
  setSaveAddress,
  setPlace,
  place,
}: any) => {
  const [inputText, setInputText] = useState('');
  const [infoDiv, setInfoDiv] = useState('');
  const onchange = (e: any) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setPlace(inputText);
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
        searchPlace={place ? place : searchCategory}
        saveLatLng={saveLatLng}
        setSaveLatLng={setSaveLatLng}
        saveAddress={saveAddress}
        setSaveAddress={setSaveAddress}
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

const StyledInfo = styled.div`
  padding: 10px;
  width: 50%;
  margin-left: 120px;
  border-radius: 5px;
  background-color: gray;
  color: white;
  text-align: center;
`;
