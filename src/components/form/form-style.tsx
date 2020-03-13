import React from "react";
import styled from "styled-components";

export const FormStyle = styled.div`
  width: 400px;
  
  button {
    float: right;
  }

  textarea {
    min-height: 80px;
  }

  input,
  textarea {
    display: block;
    padding: 12px;
    margin: 20px 0;
    width: 400px;
    min-width: 400px;
    max-width: 400px;
    max-height: 350px;
    font-size: 16px;
    border-radius: 5px;
    border-style: none;

    &:focus {
      outline-color: ${Props => Props.theme.colors.primary};
    }
  }

  textarea {
  }
  /* display: flex; */
`;
