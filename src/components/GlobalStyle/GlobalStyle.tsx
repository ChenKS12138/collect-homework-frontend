import { createGlobalStyle } from "styled-components";
import { CSSProperties } from "react";

type CssClass = string;

const handleLowerCamelCase = (str: string): string =>
  str.replace(/([A-Z])/g, (matched) => `-${matched?.toLowerCase()}`);

const flatArray = (array) =>
  Array.isArray(array[0])
    ? array.reduce(
        (accumulate, current) => accumulate.concat(flatArray(current)),
        []
      )
    : array;

const createCssClass = (className: string, style: CSSProperties): CssClass => {
  const styleString = Object.entries(style).reduce(
    (accumulate, [key, value]) =>
      (accumulate += `${handleLowerCamelCase(key)}:${value};\n`),
    ""
  );
  return `
  .${className}{
    ${styleString}
  }
`;
};

const composeCssClasses = (classes: CssClass[]) => {
  return [].concat.apply(classes).join("\n");
};

const createRadixs = (length: number): number[] =>
  Array.from({ length }).map((value, index) => index + 1);

const composedStyleString = composeCssClasses([
  ...flatArray(
    createRadixs(20).map((radix) => [
      createCssClass(`app-ma-${radix}n`, { margin: `${radix * 10}px` }),
      createCssClass(`app-ml-${radix}n`, { marginLeft: `${radix * 10}px` }),
      createCssClass(`app-mr-${radix}n`, { marginRight: `${radix * 10}px` }),
      createCssClass(`app-mt-${radix}n`, { marginTop: `${radix * 10}px` }),
      createCssClass(`app-mb-${radix}n`, { marginBottom: `${radix * 10}px` }),
    ])
  ),
  createCssClass(`app-ma-auto`, { margin: "auto" }),
  createCssClass(`app-mlr-auto`, { marginLeft: "auto", marginRight: "auto" }),
  createCssClass(`app-mtb-auto`, { marginBottom: "auto", marginTop: "auto" }),
  ...flatArray(
    createRadixs(20).map((radix) => [
      createCssClass(`app-pa-${radix}n`, { padding: `${radix * 10}px` }),
      createCssClass(`app-pl-${radix}n`, { paddingLeft: `${radix * 10}px` }),
      createCssClass(`app-pr-${radix}n`, { paddingRight: `${radix * 10}px` }),
      createCssClass(`app-pt-${radix}n`, { paddingTop: `${radix * 10}px` }),
      createCssClass(`app-pb-${radix}n`, {
        paddingBottom: `${radix * 10}px`,
      }),
    ])
  ),
  ...createRadixs(20).map((radix) =>
    createCssClass(`app-text-size-${radix}n`, {
      fontSize: `${radix * 2 + 10}px`,
    })
  ),
  ...createRadixs(20).map((radix) =>
    createCssClass(`app-text-weight-${radix}n`, { fontWeight: radix * 100 })
  ),
  ...createCssClass(`app-text-align-center`, { textAlign: "center" }),
  ...createCssClass(`app-text-align-left`, { textAlign: "left" }),
  ...createCssClass(`app-text-align-right`, { textAlign: "right" }),
  ...createCssClass(`app-box-shadow-default`, {
    boxShadow: "2px 2px 4px #909090;",
  }),
  ...createRadixs(20).map((radix) =>
    createCssClass(`app-text-height-${radix}n`, { height: radix * 2 + 20 })
  ),
  ...createRadixs(20).map((radix) =>
    createCssClass(`app-text-width-${radix}n`, { width: radix * 2 + 20 })
  ),
]);

const composedMobileStyleString = composeCssClasses([
  ...flatArray(
    createRadixs(20).map((radix) => [
      createCssClass(`app-ma-${radix}n`, { margin: `${radix * 3}px` }),
      createCssClass(`app-ml-${radix}n`, { marginLeft: `${radix * 3}px` }),
      createCssClass(`app-mr-${radix}n`, { marginRight: `${radix * 3}px` }),
      createCssClass(`app-mt-${radix}n`, { marginTop: `${radix * 3}px` }),
      createCssClass(`app-mb-${radix}n`, { marginBottom: `${radix * 3}px` }),
    ])
  ),
  ...flatArray(
    createRadixs(20).map((radix) => [
      createCssClass(`app-pa-${radix}n`, { padding: `${radix * 3}px` }),
      createCssClass(`app-pl-${radix}n`, { paddingLeft: `${radix * 3}px` }),
      createCssClass(`app-pr-${radix}n`, { paddingRight: `${radix * 3}px` }),
      createCssClass(`app-pt-${radix}n`, { paddingTop: `${radix * 3}px` }),
      createCssClass(`app-pb-${radix}n`, {
        paddingBottom: `${radix * 3}px`,
      }),
    ])
  ),
  // ...createRadixs(20).map((radix) =>
  //   createCssClass(`app-text-size-${radix}n`, {
  //     fontSize: `${radix * 1.8}px`,
  //   })
  // ),
  // ...createRadixs(20).map((radix) =>
  //   createCssClass(`app-text-height-${radix}n`, { height: radix * 2 })
  // ),
  // ...createRadixs(20).map((radix) =>
  //   createCssClass(`app-text-width-${radix}n`, { width: radix * 2 })
  // ),
]);

export default createGlobalStyle`
  ${composedStyleString}
  @media screen and (max-width: 960px) {
    ${composedMobileStyleString}
  }
  * {
    transition: all .5s ease;
  }
  body{
    margin: 0;
    color: rgba(0,0,0,.85);
    font-size: 14px;
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
    font-variant: tabular-nums;
    line-height: 1.5715;
    background-color: #fff;
    -webkit-font-feature-settings: "tnum";
    font-feature-settings: "tnum";
  }
`;
