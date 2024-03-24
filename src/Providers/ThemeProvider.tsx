import React, { PropsWithChildren } from "react";
import { createGlobalStyle } from "styled-components";

export type ThemeOut = { color: number; setColor: (newColor: number) => void };

export const InitTheme: ThemeOut = {
  color: 0,
  setColor: (newColor: number) =>
    console.log("empty setColor method in context"),
};
export const ThemeContext = React.createContext(InitTheme);

const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [color, setColor] = React.useState(110);
  const updateColor = React.useCallback((newColor: number) => {
    setColor(newColor);
  }, []);
  const value = React.useMemo(() => {
    return { color, setColor: updateColor };
  }, [color]);
  return (
    <ThemeContext.Provider value={value}>
      {children}
      <GlobalStyles baseTheme={color} />
    </ThemeContext.Provider>
  );
};

export const GlobalStyles = createGlobalStyle<{ baseTheme: number }>`
  :root {
    --dark-mode-background: hsl(${(p) => p.baseTheme} 20% 5%);
    --dark-mode-text-color: hsl(${(p) => p.baseTheme}, 6%, 84%);

    --gray-one: hsl(${(p) => p.baseTheme}, 8%, 20%);
    --blue: hsl(240,50%,10%);

  }
`;

export default ThemeProvider;
