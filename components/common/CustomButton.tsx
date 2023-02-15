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
  theme: DefaultTheme;
}

export const CustomButton = styled.button<ButtonProps>`
  border: 0.5px solid gray;
  background-color: ${(props) => props.backgroundColor || 'black'};
  color: ${(props) => props.color || 'white'};
  width: ${(props) => props.width || '60px'};
  height: ${(props) => props.height || '20px'};
  font-size: ${(props) => props.fontSize || '16px'};
  border-radius: ${(props) => props.borderRadius || '0px'};
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
  }
  &:hover {
    cursor: pointer;
    scale: 1.02;
  }
`;
