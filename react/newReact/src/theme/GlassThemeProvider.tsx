import { ReactNode } from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    min-height: 100vh;
    min-width:100vw;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: #f8fafc;
    font-family: 'Poppins', 'Montserrat', sans-serif;
    color: #222;
    margin: 0;
    min-height: 100vh;
    width: 100vw;
    overflow-x: hidden;
  }
`;

const theme = {
  primary: "#ff4081",
  secondary: "#ff9800",
  borderRadius: "18px",
  navGlass: "rgba(255,255,255,0.75)",
  navBorder: "1.5px solid #ff4081",
  cardGlass: "rgba(255,255,255,0.95)",
  cardShadow: "0 6px 32px 0 rgba(60, 60, 130, 0.07)",
};

export default function GlassThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}