import React from "react";
import styled from "styled-components";

export const MyButton = styled.div`
  background-color: ${Props => Props.theme.colors.primary};
  letter-spacing: 1pt;
  width: fit-content;
  height: fit-content;
  padding: 12px 25px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    background-color: #0ac28f;
  }
`;
