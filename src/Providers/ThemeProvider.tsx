import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { Sunrise, Sunset } from "react-feather";
import styled, { createGlobalStyle } from "styled-components";

export type ThemeOut = { color: number; setColor: (newColor: number) => void ;
                          isDark: boolean; setIsDark: React.Dispatch<React.SetStateAction<boolean>>};

export const InitTheme: ThemeOut = {
  color: 0,
  setColor: () => console.log("empty setColor method in context"),
  isDark: true,
  setIsDark: () => {console.log("empty dark setter")}

};
export const ThemeContext = createContext(InitTheme);

const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [color,  setColor] = useState(110);
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

export const DarkModeToggle: React.FC<{ className?: string }> = ({
  className,
}) => {
  const {isDark, setIsDark} = useContext(ThemeContext);

  return (
    <ToggleWrapper className={className} 
      onClick={()=>{setIsDark((isDark: boolean) => !isDark)}}>
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
