import React from "react";
import styled from "styled-components";

export const MyButton = styled.button`
  background-color: ${Props => Props.theme.colors.primary};
  letter-spacing: 1pt;
  font-size: 12px;
  outline: none;
  color: white;
  border: none;
  width: fit-content;
  height: fit-content;
  padding: 12px 25px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 600ms ease;

  &:hover {
    transform: translateY(-1px);
    background-color: #08a175;
  }
`;
