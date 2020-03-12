import React from "react";
import styled from "styled-components";

export const HomeStyling = styled.div`
  display: flex;
  align-items: flex-start;
  height: auto;
  margin-bottom: 100px;


  .home-left {
    flex: 2;
    padding: 150px 0;

    .dots {
        width: 60%;
        margin-top: 50px;
    }
  }

  .home-right {
    flex: 3;
    min-width: 600px;

    .avatar {
      padding-left: 18%;
      width: 100%;
      height: auto;
      transition: transform 300ms ease-in-out;
    }

    .shapes-wrapper {
      position: absolute;
      z-index: 10;
      padding-top: 20%;
      width: 50%;
      height: auto;
    }

    .shapes {
      overflow: visible;
      position: absolute;
      width: 50%;
      max-width: 320px;
    }

    /*
    .square {
      overflow: visible;
      position: absolute;
      width: 26%;
      max-width: 150px;
    }
    .ellipse {
      overflow: visible;
      position: absolute;
      width: 30%;
      max-width: 180px;
      margin: 60px 0 0 90px;
    }
    */
    @media screen and (max-width: 992px) {
      .shapes-wrapper {
        padding-top: 220px;
      }
    }
  }
`;
