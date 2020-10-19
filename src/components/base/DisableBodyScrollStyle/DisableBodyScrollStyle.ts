import { createGlobalStyle } from "styled-components";

const DisableBodyScrollStyle = createGlobalStyle`
  body {
    overflow: hidden;
    touch-action: none;
  }
`;

export default DisableBodyScrollStyle;
