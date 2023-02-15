import LandingPage from './LandingPage';
import React, { useState } from 'react';
import styled from 'styled-components';
import { CustomButton } from '../common/CustomButton';
const SearchPlace = () => {
  const [inputText, setInputText] = useState('');
  const [place, setPlace] = useState('');
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
        <StyleInfo> {infoDiv}</StyleInfo>
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
        searchPlace={place}
        infoDiv={infoDiv}
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
  z-index: 5;
`;

const StyledInput = styled.input`
  padding: 10px;
  width: 500px;
  border-radius: 16px;
  border: 0.5px solid black;
`;

const StyleInfo = styled.div`
  background-color: gray;
  color: white;
  padding: 5px 20px;
  text-align: center;
  border-radius: 5px;
  width: 300px;
  margin-left: 120px;
  margin-bottom: 10px;
`;
