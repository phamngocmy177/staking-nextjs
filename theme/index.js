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

    primary: darkMode ? "#F8B3C1" : "#F8B3C1",
    // text
    text1: darkMode ? "#FFFFFF" : "#313453",

    // backgrounds / greys

    mainBg: darkMode ? "#191B1F" : "#FFF9F0",
    headerBg: darkMode ? "#424242" : "#FFF9F0",

    background1: darkMode ? "#DDBBE0" : "#DDBBE0",
    //specialty colors
    modalBG: darkMode ? "rgba(0,0,0,.425)" : "rgba(0,0,0,0.3)",

    //primary colors

    // color text

    // secondary colors
    secondary1: darkMode ? "#2172E5" : "#E8006F",
    secondary2: darkMode ? "#17000b26" : "#F6DDE8",
    secondary3: darkMode ? "#17000b26" : "#FDEAF1",
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
    typography: {
      fontFamily: "Quicksand",
    },
    overrides: {
      MuiCssBaseline: {
        "@global": {
          "@font-face": [
            {
              fontFamily: "Quicksand",
              fontStyle: "normal",
              fontDisplay: "swap",
            },
          ],
        },
      },
    },
    ...themeObject,
  });
  return myTheme;
};
