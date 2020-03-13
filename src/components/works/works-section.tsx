/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-concat */
import React, { useState, Component, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { WorkSectionStyling } from "./work-section-style";
import "animate.css/animate.min.css";
import ScrollAnimation from "react-animate-on-scroll";
import { MyButton } from "../button/button-style";

interface Props {
  right?: any;
  img: string;
  title?: any;
  p?: string;
  icons: string[];
}

const off = 150;

export const WorksSection = (Props: Props) => {
  console.log(Props.icons);

  return (
    <WorkSectionStyling right={Props.right}>
      <div className="work-image">
        <ScrollAnimation
          animateIn={Props.right ? "fadeInRight" : "fadeInLeft"}
          duration={1}
          offset={off}
          delay={100}
        >
          <img
            src={Props.img}
            alt="SkateTerrain app"
            className="SkateTerrain"
          />
          <div className="overlay"><h2>Check me out</h2></div>
        </ScrollAnimation>
      </div>

      <div className="work-text">
        <ScrollAnimation
          animateIn="fadeInUp"
          duration={1}
          offset={off}
          delay={200}
        >
          <h1>{Props.title}</h1>
        </ScrollAnimation>
        <ScrollAnimation
          animateIn="fadeInUp"
          duration={1}
          offset={off}
          delay={300}
        >
          <p>{Props.p}</p>
          <div className="madeWith">
            <p className="Psmall">Made with</p>
            <div className="icons-wrapper">
              {Props.icons.map((icon, i) => {
                return (
                  <div key={i} className="icons">
                    <img src={icon} />
                  </div>
                );
              })}
            </div>
          </div>
          <MyButton className="MyButton">View</MyButton>
        </ScrollAnimation>
      </div>
    </WorkSectionStyling>
  );
};
