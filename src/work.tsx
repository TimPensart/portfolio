import React, { Fragment } from "react";
import { AboutStyling } from "./styles/about-style";
import { WorkStyling } from "./styles/work-style";
import { WorksSection } from "./components/works/works-section";
import SkateTerrain from "./assets/skateTerrainApp.png";
import FloatingMelodies from "./assets/floating-melodies-webpage.jpg";
import fireBaseIcon from "./assets/icons/icons8-firebase-144.png";
import googleMapsIcon from "./assets/icons/icons8-google-maps-old-144.png";
import androidStudioIcon from "./assets/icons/android-studio-png-transparent.png";
import javaIcon from "./assets/icons/java-icon.png";
import htmlIcon from "./assets/icons/HTML5_logo.svg";
import cssIcon from "./assets/icons/CSS3_logo.svg";
import jsIcon from "./assets/icons/javascript.svg";

export const SkateTerrainText =
  "An app made for skaters with a passion for street skating. With SkateTerrain skaters will never have to forget skate spots again. You can check out any skate spot on the map or even add new ones if youd like!";

const SkateTerrainIcons = [
  fireBaseIcon,
  googleMapsIcon,
  androidStudioIcon,
  javaIcon
];

export const FloatingMelodiesText =
  "Floating Melodies is an installation made for kids. The height of the balloons determines the pitch of each note in the melody. This installation is perfect for a musical event where kids are welcome.";

const FloatingMelodiesIcons = [htmlIcon, cssIcon, jsIcon];

export const Work = () => (
  <WorkStyling>
    <WorksSection
      img={SkateTerrain}
      p={SkateTerrainText}
      icons={SkateTerrainIcons}
      title={<span>Skate<span className="stroke">Terrain</span></span>}
    />
    <WorksSection
      right
      img={FloatingMelodies}
      p={FloatingMelodiesText}
      icons={FloatingMelodiesIcons}
      title={<span>Floating <span className="stroke">Melodies</span></span>}
    />
  </WorkStyling>
);
