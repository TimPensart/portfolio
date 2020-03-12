import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    @import url("https://use.typekit.net/zhp6wxe.css");

    * {
        font-family: nimbus-sans, sans-serif;
        font-style: normal;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        background-color: #1d1d1d;
        overflow-x: hidden;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }

        to {
            opacity: 1;
            transform: none;
        }
    }

    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }

        to {
            opacity: 1;
            transform: none;
        }
    }

    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }

        to {
            opacity: 1;
            transform: none;
        }
    }
`;

export default GlobalStyle;
