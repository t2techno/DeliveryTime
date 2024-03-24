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
      <GlobalStyles baseTheme={color} isDark={isDark} />
    </ThemeContext.Provider>
  );
};

export const GlobalStyles = createGlobalStyle<{
  baseTheme: number;
  isDark: boolean;
}>`
  :root {
    --dark-mode-background: hsl(${(p) => p.baseTheme} 20% 10%);
    --light-mode-background: hsl(${(p) => p.baseTheme} 20% 75%);

    --dark-mode-text-color: hsl(${(p) => p.baseTheme}, 6%, 84%);
    --light-mode-text-color: hsl(${(p) => p.baseTheme}, 6%, 5%);

    --gray-one: hsl(${(p) => p.baseTheme}, 8%, 20%);
    --dark-blue: hsl(240,50%,10%);
    --light-blue:hsl(200,50%,60%);

    --background-color: ${(p) =>
      p.isDark
        ? "var(--dark-mode-background)"
        : "var(--light-mode-background)"};
    --text-color: ${(p) =>
      p.isDark
        ? "var(--dark-mode-text-color)"
        : "var(--light-mode-text-color)"};

    --blue: ${(p) => (p.isDark ? "var(--dark-blue)" : "var(--light-blue)")};

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
