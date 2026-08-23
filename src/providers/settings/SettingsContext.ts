import { createContext } from "react";

interface SettingsContextValue {
  tickLength: number;
  setTickLength: React.Dispatch<React.SetStateAction<number>>;
  avgSize: number;
  setAvgSize: React.Dispatch<React.SetStateAction<number>>;
  resetSettings: () => void;
}

export const defaultTickLength = 1;
export const defaultAvgSize = 5;

const emptySettingsContextValue: SettingsContextValue = {
  tickLength: defaultTickLength,
  avgSize: defaultAvgSize,
  setTickLength: () => {
    console.error("Set Tick Length not implemented");
  },
  setAvgSize: () => {
    console.error("Set Avg Size is not implemented");
  },
  resetSettings: () => {
    console.error("Reset Settings not implemented");
  },
};

const SettingsContext = createContext<SettingsContextValue>(
  emptySettingsContextValue,
);

export const TICK_KEY = "tick";
export const AVG_KEY = "avgSize";

// Get stored values on initial page load
export const initialTickLength =
  Number(localStorage.getItem(TICK_KEY)) || defaultTickLength;

export const initialAvgSize =
  Number(localStorage.getItem(AVG_KEY)) || defaultAvgSize;

export default SettingsContext;
