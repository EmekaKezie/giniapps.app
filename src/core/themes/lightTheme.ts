import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4E5E75",
      light: "#d3e3fd",
    },
    secondary: {
      main: "#082651",
    },
    error: {
      main: "#D32F2F",
      // light: "#EF9A9A",
    },
    info: {
      main: "#4C85F8",
      // light: "#e8f4fd",
    },
    success: {
      main: "#28a745",
    },
    warning: {
      main: "#FFAB00",
      // light: "#fff8d4",
    },
    common: {
      black: "#000000",
      white: "#ffffff",
    },
    background: {
      default: "#F6F9FD",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1F1F1F",
      secondary: "#5E5E5E",
      disabled: "#BDBDBD",
    },
    grey: {
      50: "#E9ECF3", //--
      100: "#F1F1F1", //-
      200: "#E8F1FE",
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
