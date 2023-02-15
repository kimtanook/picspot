import LandingPage from './LandingPage';
import React, { useState } from 'react';
import styled from 'styled-components';
import { CustomButton } from '../common/CustomButton';

const SearchPlace = ({
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
      <StlyedForm onSubmit={handleSubmit}>
        <StyledInfo>{infoDiv}</StyledInfo>
        <StyledInput
          placeholder="지역 + 지명을 검색해주세요."
          onChange={onchange}
          value={inputText}
        />

        <CustomButton width="60px" borderRadius="30px" height="35px">
          검색
        </CustomButton>
      </StlyedForm>

      <LandingPage
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

export default SearchPlace;

const StyleContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

const StlyedForm = styled.form`
  position: absolute;
  top: 10px;
  z-index: 999;
`;

const StyledInput = styled.input`
  padding: 10px;
  width: 500px;
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
