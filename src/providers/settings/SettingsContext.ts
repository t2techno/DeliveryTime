import { createContext } from "react";

interface SettingsContextValue {
  tickLength: number;
  setTickLength: React.Dispatch<React.SetStateAction<number>>;
  resetSettings: () => void;
}

export const defaultTickLength = 1;

const emptySettingsContextValue: SettingsContextValue = {
  tickLength: defaultTickLength,
  setTickLength: () => {
    console.error("Set Tick Length not implemented");
  },
  resetSettings: () => {
    console.error("Reset Settings not implemented");
  },
};

const SettingsContext = createContext<SettingsContextValue>(
  emptySettingsContextValue,
);

// Get stored values on initial page load
export const initialTickLength =
  Number(localStorage.getItem("tick")) || defaultTickLength;

export default SettingsContext;
