/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-concat */
import React, { useState, Component } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { StyledNav } from "./navbar-style";
import logo from "../../assets/LogoName.svg";
import * as Scroll from "react-scroll";
import "animate.css/animate.min.css";

const ScrollLink = Scroll.Link;

export const Navbar = () => {
  const [isChecked, setChecked] = useState(true);

  const changeChecked = () => {
    setChecked(!isChecked);
  };

  return (
    <StyledNav>
      <div>
        <img className="logo" src={logo} alt="logo tim pensart" />
      </div>
      <div className="nav">
        <ul>
          <li>
            <ScrollLink to="work" smooth={true} duration={1000}>
              Work
            </ScrollLink>
          </li>
          <li>
            <ScrollLink to="about" smooth={true} duration={1000}>
              About
            </ScrollLink>
          </li>
          <li>
            <ScrollLink to="contact" smooth={true} duration={1000}>
              Contact
            </ScrollLink>
          </li>
        </ul>
      </div>
    </StyledNav>
  );
};
