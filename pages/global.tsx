import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: Noto Sans CJK KR
  }
`;

export default GlobalStyle;
