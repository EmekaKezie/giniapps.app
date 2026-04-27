import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8C9AB2",
      light: "#363F52",
    },
    secondary: {
      main: "#C0C8D0",
    },
    error: {
      main: "#D32F2F",
      light: "#fdd3d3",
    },
    info: {
      main: "#4C85F8",
      light: "#d3e3fd",
    },
    success: {
      main: "#28a745",
    },
    warning: {
      main: "#FFAB00",
    },
    common: {
      black: "#000000",
      white: "#ffffff",
    },
    background: {
      default: "#121212",
      paper: "#1A1A1A",
    },
    text: {
      primary: "#E3E3E3",
      secondary: "#ABABAB",
      disabled: "#6D6D6D",
    },
    grey: {
      50: "#232736", //--
      100: "#27272A", //-
      200: "#1B1E2B",
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
      600: "#A4A4A4",
      700: "#66666629",
      800: "#181433",
      900: "#212121",
      A100: "#EAECF0", //--
      A200: "#FCFBF7", //--
      A400: "#303030",
      A700: "#616161",
    },
  },
  // typography: {
  //   fontFamily: "Roboto, Arial, sans-serif",
  //   fontWeightLight: 300, // Thin
  //   fontWeightRegular: 400, // Normal
  //   fontWeightMedium: 500, // Medium
  //   fontWeightBold: 700, // Bold
  // },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    body1: {
      fontWeight: 400, // Regular font
    },
    body2: {
      fontWeight: 400, // Regular font
    },
  },
});
