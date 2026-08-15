import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

interface SettingsContextValue {
  tickLength: number;
  setTickLength: React.Dispatch<React.SetStateAction<number>>;
}

const emptySettingsContextValue: SettingsContextValue = {
  tickLength: 1,
  setTickLength: () => {
    console.error("Set Tick Length not implemented");
  },
};

// Get stored values on initial page load
const initialTickLength = Number(localStorage.getItem("tick")) || 1;

export const SettingsContext = createContext<SettingsContextValue>(
  emptySettingsContextValue,
);
const SettingsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [tickLength, setTickLength] = useState(initialTickLength);

  useEffect(() => {
    localStorage.setItem("tick", `${tickLength}`);
  }, [tickLength]);

  return (
    <SettingsContext.Provider value={{ tickLength, setTickLength }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
