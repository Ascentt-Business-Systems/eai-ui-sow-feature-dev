import { createTheme } from "@mui/material";
declare module "@mui/material/styles" {
  interface Palette {
    graph1: { main: string; secondary: string, line: string; };
    graph2: { main: string; secondary: string, line: string; };
    graph3: { main: string; secondary: string, line: string; };
    graph4: { main: string; secondary: string, line: string; };
    graph5: { main: string; secondary: string, line: string; };
  }
  interface PaletteOptions {
    graph1?: { main: string; secondary: string, line: string; };
    graph2?: { main: string; secondary: string, line: string; };
    graph3?: { main: string; secondary: string, line: string; };
    graph4?: { main: string; secondary: string, line: string; };
    graph5?: { main: string; secondary: string, line: string; };
  }
}

export const darkTheme = createTheme({
  typography: {
    fontFamily: 'Toyota', // Use Roboto as the default font
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#EB0A1E",
    },
    secondary: {
      main: "#c1c1c1",
    },
    error: {
      main: "#f65041",
      contrastText: "#f65041",
    },
    text: {
      secondary: "#EB0A1E",
    },
  },
});

export const lightTheme = createTheme({
  typography: {
    fontFamily: 'Toyota', // Use Roboto as the default font
  },
  palette: {
    mode: "light",
    primary: {
      main: "#0A5D8B",
      contrastText: "#0A5D8B"
    },
    secondary: {
      main: "#4399e3",
    },
    text: {
      secondary: "#797c83",
      primary: "#000",
      disabled: "#D8D8D8"
    },
    error: {
      main: "#EB0A1E",
      contrastText: "#f65041",
    },
    info: {
      main: "#2469FF"
    },
    success: {
      main: "#009B0D"
    },
    warning: {
      main: "#FBD03B",
      dark: "#F8B319"
    },
    background: {
      default: "white",
      paper: "rgba(0,0,0,0.5)",
    },
    common: {
      white: "#fff"
    },
    grey: {
      "100": "#F0F0F0",
      "200": "#E9E9E9",
      "300": "#D8D8D8",
      "400": "#BDBDBD",
      "500": "#9E9E9E",
      "600": "#767676",
      "700": "#58595B",
      "800": "#424242",
      "900": "#212121",
    },
  },
});
