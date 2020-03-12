import React from "react";
import styled from "styled-components";

interface Props {
  right?: boolean;
}

export const WorkSectionStyling = styled.div<Props>`
  display: flex;
  margin-bottom: 150px;

  .work-image {
    height: auto;
    max-width: 450px;
    width: auto;
    flex: 1;
    order: ${(p: Props) => (p.right ? "3" : "1")};
    /*margin-left: ${(p: Props) => (p.right ? "auto" : "0")};*/

    .SkateTerrain {
      width: 100%;
      height: auto;
    }
  }

  .work-text {
    max-width: 550px;
    flex: 1;
    order: 2;
    margin: ${(p: Props) => (p.right ? "0 80px 0 auto" : "0 8vw 0 80px")};

    h1 {
      @supports (-webkit-text-stroke: 1px white) {
      span.stroke {
        -webkit-text-fill-color: rgba(0,0,0,0);
        -webkit-text-stroke: 1px white;
        paint-order:  stroke fill;
        }
      }
    }
    

    .madeWith {
      .Psmall {
        padding: 40px 0 20px 0;
        font-size: 14px;
      }

      .icons-wrapper {
        display: flex;

        .icons {
          width: auto;
          min-width: 60px;
          height: 60px;
          margin: 0 30px 20px 0;

          img {
            height: 100%;
            display: block;
            margin: 0 auto;
          }
        }
      }
    }

    .MyButton {
      margin-top: 40px;
    }
  }
`;
