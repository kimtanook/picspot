import MapLandingPage from './MapLandingPage';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import styled from 'styled-components';
import { CustomButton } from '../common/CustomButton';
const SearchPlace = () => {
  const [inputText, setInputText] = useState('');
  const [place, setPlace] = useState('');

  const onchange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPlace(inputText);
    setInputText('');
  };

  return (
    <StyleContainer>
      <StlyedForm onSubmit={handleSubmit}>
        <StyledInput
          placeholder="지역 + 지명을 검색해주세요."
          onChange={onchange}
          value={inputText}
        />

        <CustomButton width="60px" borderRadius="30px" height="35px">
          검색
        </CustomButton>
      </StlyedForm>

      <MapLandingPage searchPlace={place} />
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

// const SearchWrap = styled.div`
//   width: 100%;
//   position: relative;
//   height: 100vh;

//   @media (max-width: 1100px) {
//     order: 1;
//     width: 100%;
//     height: 50vh;
//   }
// `;
// const SearchForm = styled.form`
//   position: absolute;
//   top: 5%;
//   left: 5%;
//   background-color: #fff;
//   border: 1px solid red;
//   padding: 1em;
//   z-index: 999;

//   > p {
//     margin-bottom: 1em;
//     line-height: 1.3;
//     font-size: 20px;
//     font-weight: 600;

//     > span {
//       color: #33a264;
//     }
//   }
// `;

// const InputBox = styled.div`
//   height: 30px;
//   display: flex;

//   > input {
//     width: 240px;
//     padding: 8px;
//     border: 1px solid #ddd;
//     border-radius: 50px;
//   }
//   > button {
//     border-radius: 50px;
//     border: 0;
//     padding: 0 10px;
//     color: #fff;
//     font-weight: 500;
//     background-color: #33a264;
//   }
// `;
