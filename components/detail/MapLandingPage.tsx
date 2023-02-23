import React, { useState } from 'react';
import styled from 'styled-components';
import { CustomButton } from '../common/CustomButton';
import Maps from './Maps';

const MapLandingPage = ({
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
        <StyledInfo>{infoDiv}</StyledInfo>
        <StyledInput
          placeholder="제주도 지역명을 검색해주세요."
          onChange={onchange}
          value={inputText}
        />
        <CustomButton
          width="80px"
          borderRadius="20px"
          height="35px"
          margin="20px 10px"
          color="white"
          backgroundColor="black"
        >
          검색
        </CustomButton>
      </StyledForm>

      <Maps
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

export default MapLandingPage;

const StyleContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

const StyledForm = styled.form`
  position: absolute;
  top: 10px;
  z-index: 999;
  text-align: center;
`;

const StyledInput = styled.input`
  padding: 10px;
  width: 300px;
  border-radius: 16px;
  border: 0.3px solid black;
`;

const StyledInfo = styled.div`
  color: black;
  background-color: white;
  padding: 5px 0px;
  font-size: 16px;
`;
