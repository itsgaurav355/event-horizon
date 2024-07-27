import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline, createTheme } from "@mui/material";
import themeObj from './palatte.js';

const theme = createTheme(themeObj);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
