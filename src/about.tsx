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
        <h1>My<br /><span>Story.</span></h1>
      </ScrollAnimation>
      <p>
        Hi! my name is Tim Pensart, I'm an interaction/UX design student at Luca
        School of Arts in Belgium. I like to consider myself to be a
        perfectionist when it comes to delivering a product, while respecting
        the deadline at the same time. If you're looking for someone to
        design/develop a website, design a brand or build an interactive
        installation, feel free to contact me. Questions are always welcome!
      </p>
    </div>
  </AboutStyling>
);
