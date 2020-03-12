import React, { Fragment } from "react";
import avatar from "./assets/gradient picture square.png";
import shapes from "./assets/Shapes.svg";
import square from "./assets/codegradientblock.svg";
import ellipse from "./assets/ellipsegradienttext.svg";
import dotpattern from "./assets/CirclePattern.svg";
import { HomeStyling } from "./styles/home-style";
import "animate.css/animate.min.css";
import ScrollAnimation from "react-animate-on-scroll";

export const dur = 1;

export const Home = () => (
  // props.match.params.name
  <Fragment>
    <HomeStyling>
      <div className="home-left">
        <ScrollAnimation
          animateIn="fadeInLeft"
          animateOnce={true}
          duration={dur}
          offset={0}
          delay={0}
        >
          <img src={dotpattern} alt="dots" className="dots" />
        </ScrollAnimation>
      </div>
      <div className="home-right">
        <div className="shapes-wrapper">
          <ScrollAnimation
            animateIn="fadeInUp"
            animateOnce={true}
            duration={dur}
            offset={0}
            delay={300}
          >
            <img src={shapes} className="shapes" alt="code" />
          </ScrollAnimation>

          {/* 
          <ScrollAnimation animateIn="fadeInLeft" animateOnce={true} duration={dur} offset={0} delay={0}>
            <img src={square} className="square" alt="code" />
          </ScrollAnimation>

          
          <ScrollAnimation animateIn="fadeInRight" animateOnce={true} duration={dur} offset={0} delay={0} >
            <img src={ellipse} className="ellipse" alt="design" />
          </ScrollAnimation> */}
        </div>
        <div className="pic wrapper">
          <ScrollAnimation
            animateIn="fadeInRight"
            animateOnce={true}
            duration={dur}
            offset={0}
            delay={0}
          >
            <img className="avatar" src={avatar} alt="my picture" />
          </ScrollAnimation>
        </div>
      </div>
    </HomeStyling>
  </Fragment>
);
