/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import styled from "styled-components";

export const StyledNav = styled.div`
  z-index: 100;
  position: absolute;
  display: flex;
  width: 100%;
  align-items: center;
  overflow: hidden;
  color: white;
  padding: 0 15vw 0 4vw;

  a {
    text-decoration: none;
    color: inherit;
  }

  h1 {
    margin: 0;
    float: left;
    color: inherit;
    font-size: 20px;
  }

  .logo {
    color: white;
    min-width: 120px;
    width: 15vw;
    max-width: 200px;
    margin: 30px 0;
  }

  .nav {
    margin-left: auto;
    float: right;
    user-select: none;

    ul {
      padding: 0;
      display: flex;
      

      li {
        display: inline-block;
        padding: 0 3vw;
        cursor: pointer;

        a {
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
`;
