import {
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import SettingsContext, {
  defaultTickLength,
  initialTickLength,
} from "./SettingsContext";

const SettingsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [tickLength, setTickLength] = useState(initialTickLength);

  useEffect(() => {
    localStorage.setItem("tick", `${tickLength}`);
  }, [tickLength]);

  const resetSettings = useCallback(() => {
    setTickLength(defaultTickLength);
  }, []);

  return (
    <SettingsContext.Provider
      value={{ tickLength, setTickLength, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
