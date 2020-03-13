import React from "react";
import styled from "styled-components";

export const ContactStyling = styled.div`
  padding: 100px 20vw;
  width: 100%;
  height: auto;
  display: flex;

  .contact-wrapper {
    justify-self: flex-end;
    margin-left: auto;

    .header-wrap {
      margin-left: auto;
      text-align: right;

      h1,
      h2,
      h3 {
        padding: 0;
        margin: 0;
      }

      h1 span {
        -webkit-text-fill-color: rgba(0, 0, 0, 0);
        -webkit-text-stroke: 1px white;
        font-size: 1.2em;
      }
    }
  }
`;
