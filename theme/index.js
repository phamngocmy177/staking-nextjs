import { createTheme } from "@material-ui/core/styles";
import { useMemo } from "react";
import { useIsDarkMode } from "../state/user/hooks";

export const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
};

// Migrating to a standard z-index system https://getbootstrap.com/docs/5.0/layout/z-index/
// Please avoid using deprecated numbers
export const Z_INDEX = {
  deprecated_zero: 0,
  deprecated_content: 1,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  offcanvas: 1050,
  modal: 1060,
  popover: 1070,
  tooltip: 1080,
};

const white = "#FFFFFF";
const black = "#000000";

export function colors(darkMode) {
  return {
    darkMode,
    // base
    white,
    black,

    // text
    text1: darkMode ? "#FFFFFF" : "#000000",
    text2: darkMode ? "#C3C5CB" : "#565A69",
    text3: darkMode ? "#8F96AC" : "#6E727D",
    text4: darkMode ? "#B2B9D2" : "#C3C5CB",
    text5: darkMode ? "#2C2F36" : "#EDEEF2",

    // backgrounds / greys
    bg0: darkMode ? "#191B1F" : "#FFF",
    bg1: darkMode ? "#212429" : "#F7F8FA",
    bg2: darkMode ? "#2C2F36" : "#EDEEF2",
    bg3: darkMode ? "#40444F" : "#CED0D9",
    bg4: darkMode ? "#565A69" : "#888D9B",
    bg5: darkMode ? "#6C7284" : "#888D9B",
    bg6: darkMode ? "#1A2028" : "#6C7284",

    //specialty colors
    modalBG: darkMode ? "rgba(0,0,0,.425)" : "rgba(0,0,0,0.3)",
    advancedBG: darkMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.6)",

    //primary colors
    primary1: darkMode ? "#2172E5" : "#E8006F",
    primary2: darkMode ? "#3680E7" : "#FF8CC3",
    primary3: darkMode ? "#4D8FEA" : "#FF99C9",
    primary4: darkMode ? "#376bad70" : "#F6DDE8",
    primary5: darkMode ? "#153d6f70" : "#FDEAF1",

    // color text
    primaryText1: darkMode ? "#5090ea" : "#D50066",

    // secondary colors
    secondary1: darkMode ? "#2172E5" : "#E8006F",
    secondary2: darkMode ? "#17000b26" : "#F6DDE8",
    secondary3: darkMode ? "#17000b26" : "#FDEAF1",

    // other
    red1: darkMode ? "#FF4343" : "#DA2D2B",
    red2: darkMode ? "#F82D3A" : "#DF1F38",
    red3: "#D60000",
    green1: darkMode ? "#27AE60" : "#007D35",
    yellow1: "#E3A507",
    yellow2: "#FF8F00",
    yellow3: "#F3B71E",
    blue1: darkMode ? "#2172E5" : "#0068FC",
    blue2: darkMode ? "#5199FF" : "#0068FC",
    error: darkMode ? "#FD4040" : "#DF1F38",
    success: darkMode ? "#27AE60" : "#007D35",
    warning: "#FF8F00",

    // dont wanna forget these blue yet
    blue4: darkMode ? "#153d6f70" : "#C4D9F8",
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',
  };
}

function theme(darkMode) {
  return {
    colors: colors(darkMode),

    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },

    //   //shadows
    //   shadow1: darkMode ? '#000' : '#2F80ED',

    //   // media queries
    //   mediaWidth: mediaWidthTemplates,

    //   // css snippets
    //   flexColumnNoWrap: css`
    //     display: flex;
    //     flex-flow: column nowrap;
    //   `,
    //   flexRowNoWrap: css`
    //     display: flex;
    //     flex-flow: row nowrap;
    //   `,
  };
}

export const useTheme = () => {
  const darkMode = useIsDarkMode();
  const themeObject = useMemo(() => theme(darkMode), [darkMode]);
  const myTheme = createTheme({
    // Theme settings
    palette: {
      type: darkMode ? "dark" : "light",
    },
    ...themeObject,
  });
  return myTheme;
};
