import React from "react";
import { ContactStyling } from "./styles/contact-style";
import "animate.css/animate.min.css";
import ScrollAnimation from "react-animate-on-scroll";
import { MyForm } from "./components/form/form";

export const Contact = () => (
  <ContactStyling>
    <div className="contact-wrapper">
      <div className="header-wrap">
      <ScrollAnimation
        animateIn="fadeInUp"
        duration={1}
        offset={150}
        delay={100}
      >
          <h1>
            Get in <br />
            <span>touch</span>
          </h1>
        </ScrollAnimation>
      </div>

      <MyForm />
    </div>
  </ContactStyling>
);
