import {
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

import SettingsContext, {
  AVG_KEY,
  defaultAvgSize,
  defaultTickLength,
  initialAvgSize,
  initialTickLength,
  TICK_KEY,
} from "./SettingsContext";

const SettingsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [tickLength, setTickLength] = useState(initialTickLength);
  const [avgSize, setAvgSize] = useState(initialAvgSize);

  useEffect(() => {
    localStorage.setItem(TICK_KEY, `${tickLength}`);
  }, [tickLength]);

  useEffect(() => {
    localStorage.setItem(AVG_KEY, `${avgSize}`);
  }, [avgSize]);

  const resetSettings = useCallback(() => {
    setTickLength(defaultTickLength);
    setAvgSize(defaultAvgSize);
  }, []);

  return (
    <SettingsContext.Provider
      value={{ tickLength, setTickLength, avgSize, setAvgSize, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
