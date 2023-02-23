import styled, { DefaultTheme } from 'styled-components';

interface ButtonProps {
  backgroundColor?: string;
  color?: string;
  width?: number | string;
  height?: number | string;
  fontSize?: number | string;
  padding?: number | string;
  borderRadius?: number | string;
  children?: string;
  border?: number | string;
  margin?: number | string;
  theme: DefaultTheme;
}

export const CustomButton = styled.button<ButtonProps>`
  background-color: ${(props) => props.backgroundColor || '#e7e7e7'};
  color: ${(props) => props.color || 'black'};
  width: ${(props) => props.width || '50px'};
  height: ${(props) => props.height || '25px'};
  font-size: ${(props) => props.fontSize || '16px'};
  border-radius: ${(props) => props.borderRadius || '25px'};
  padding: ${(props) => props.padding || '0px'};
  border: ${(props) => props.border || '1px solid black;'};
  margin: ${(props) => props.margin || '5px'};
  border: ${(props) => props.border || 'none'};
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
  }
  /* &:hover {
    cursor: pointer;
    scale: 1.02;
  } */
`;
