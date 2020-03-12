import React, { useEffect } from "react";
import { Navbar } from "./components/navbar/navbar";
import { Home } from "./home";
import { Work } from "./work";
import { About } from "./about";
import { Contact } from "./contact";
import GlobalStyle from "./styles/global";
import { MainStyle } from "./styles/main-style";
import { ThemeProvider } from "styled-components";
import light from "./styles/themes/light";
import * as Scroll from "react-scroll";
import { animateScroll as scroll } from "react-scroll";

function App() {
  useEffect(() => {
    scrollToTop();
  });

  const scrollToTop = () => {
    scroll.scrollToTop();
  };

  return (
    <div>
      <ThemeProvider theme={light}>
        <GlobalStyle />

        <Navbar />

        <MainStyle>
          <Home />

          <div id="work">
            <Work />
          </div>
          <div id="about">
            <About />
          </div>
        </MainStyle>
      </ThemeProvider>
    </div>
  );
}

export default App;
