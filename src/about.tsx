import React from "react";
import { AboutStyling } from "./styles/about-style";
import "animate.css/animate.min.css";
import ScrollAnimation from "react-animate-on-scroll";

export const About = () => (
  // props.match.params.name
  <AboutStyling>
    <div>
      <ScrollAnimation
        animateIn="fadeInUp"
        duration={1}
        offset={150}
        delay={100}
      >
        <h1>My Story</h1>
      </ScrollAnimation>
    </div>
  </AboutStyling>
);
