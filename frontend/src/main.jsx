import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import "./index.css";
import App from "./App.jsx";

// Create a modern MUI theme
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1a73e8", // modern blue
    },
    secondary: {
      main: "#ff6f61", // coral accent
    },
    background: {
      default: "#f6f9fc", // soft background
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 12, // modern rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "8px 18px",
          boxShadow: "0px 3px 10px rgba(26,115,232,0.2)",
          "&:hover": {
            boxShadow: "0px 4px 14px rgba(26,115,232,0.3)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
        },
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
