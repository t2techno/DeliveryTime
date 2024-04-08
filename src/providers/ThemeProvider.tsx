import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { Sunrise, Sunset } from "react-feather";
import styled, { createGlobalStyle } from "styled-components";

export type ThemeOut = {
  color: number;
  setColor: (newColor: number) => void;
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
};

export const InitTheme: ThemeOut = {
  color: 0,
  setColor: () => console.log("empty setColor method in context"),
  isDark: true,
  setIsDark: () => console.log("empty dark setter"),
};
export const ThemeContext = createContext(InitTheme);

const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [color, setColor] = useState(110);
  const [isDark, setIsDark] = useState(true);
  const updateColor = useCallback((newColor: number) => {
    setColor(newColor);
  }, []);
  const value = React.useMemo(() => {
    return { color, setColor: updateColor, isDark, setIsDark };
  }, [color, isDark]);
  return (
    <ThemeContext.Provider value={value}>
      {children}
      <GlobalStyles baseHue={color} isDark={isDark} />
    </ThemeContext.Provider>
  );
};

export const GlobalStyles = createGlobalStyle<{
  baseHue: number;
  isDark: boolean;
}>`
  :root {

    --base-hue: ${(p) => p.baseHue}deg;
    --opposite-hue: ${(p) => p.baseHue - 270};
    --dark-mode-background: hsl(var(--base-hue) 40% 10%);
    --light-mode-background: hsl(var(--base-hue) 40% 70%);

    --dark-mode-text-color: hsl(var(--base-hue), 6%, 84%);
    --light-mode-text-color: hsl(var(--base-hue), 6%, 5%);

    --dark-gray: hsl(${(p) => p.baseHue}, 18%, 20%);
    --light-gray: hsl(${(p) => p.baseHue}, 28%, 80%);

    --dark-blue: hsl(195 70% 30%);
    --light-blue: hsl(195 70% 80%);

    --dark-red: hsl(350, 80%, 30%);
    --light-red: hsl(350, 70%, 55%);

    --dark-gold: hsl(50, 100%, 40%);
    --light-gold: hsl(50, 70%, 80%);

    --dark-button-edge: hsl(var(--base-hue) 50% 5%) 0%,
      hsl(var(--base-hue) 50% 32%) 8%,
      hsl(var(--base-hue) 50% 32%) 92%,
      hsl(var(--base-hue) 50% 5%) 100%;

    --light-button-edge: hsl(var(--base-hue) 50% 5%) 0%,
      hsl(var(--base-hue) 50% 12%) 8%,
      hsl(var(--base-hue) 50% 12%) 92%,
      hsl(var(--base-hue) 50% 5%) 100%;
    

    --dark-button-face: hsl(var(--base-hue) 50% 15%);
    --light-button-face: hsl(var(--base-hue) 50% 75%);

    --background-color: ${(p) =>
      p.isDark
        ? "var(--dark-mode-background)"
        : "var(--light-mode-background)"};
    --text-color: ${(p) =>
      p.isDark
        ? "var(--dark-mode-text-color)"
        : "var(--light-mode-text-color)"};

    --background-gray: ${(p) =>
      p.isDark ? "var(--dark-gray)" : "var(--light-gray)"};

    --fancy-button-edge: ${(p) =>
      p.isDark ? "var(--dark-button-edge)" : "var(--light-button-edge)"}; 
    --fancy-button-face: ${(p) =>
      p.isDark ? "var(--dark-button-face)" : "var(--light-button-face)"}; 

    --blue: ${(p) => (p.isDark ? "var(--light-blue)" : "var(--dark-blue)")};
    --red: ${(p) => (p.isDark ? "var(--light-red)" : "var(--dark-red)")};
    --gold: ${(p) => (p.isDark ? "var(--light-gold)" : "var(--dark-gold)")};

  }
`;

export const DarkModeToggle: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { isDark, setIsDark } = useContext(ThemeContext);

  return (
    <ToggleWrapper
      className={className}
      onClick={() => {
        setIsDark((isDark: boolean) => !isDark);
      }}
    >
      {isDark ? <ToLightMode /> : <ToDarkMode />}
    </ToggleWrapper>
  );
};

const ToggleWrapper = styled.div`
  width: 3rem;
  height: 3rem;
`;

const ToLightMode = styled(Sunrise)`
  width: 100%;
  height: 100%;
  color: var(--text-color);
`;

const ToDarkMode = styled(Sunset)`
  width: 100%;
  height: 100%;
  color: var(--text-color);
`;

export default ThemeProvider;
