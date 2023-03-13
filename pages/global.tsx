import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    font-family: 'Noto Sans KR', sans-serif;
  }

  body {
    box-sizing: border-box;
    margin: 0;
    padding: 0;

  }
`;

export default GlobalStyle;
