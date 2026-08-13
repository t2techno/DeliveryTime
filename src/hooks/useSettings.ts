import { useCallback, useEffect, useState } from "react";

interface SettingsValue {
  isAvg: boolean;
  toggleIsAvg: () => void;
  tickLength: number;
  setTickLength: React.Dispatch<React.SetStateAction<number>>;
}

// Get stored values on initial page load
const initialIsAvg = Boolean(localStorage.getItem("isAvg"));
const initialTickLength = Number(localStorage.getItem("tick")) || 1;

const useSettings = (): SettingsValue => {
  const [isAvg, setIsAvg] = useState(initialIsAvg);
  const [tickLength, setTickLength] = useState(initialTickLength);

  const toggleIsAvg = useCallback(() => {
    setIsAvg((current) => !current);
  }, []);

  useEffect(() => {
    localStorage.setItem("isAvg", `${isAvg}`);
  }, [isAvg]);

  useEffect(() => {
    localStorage.setItem("tick", `${tickLength}`);
  }, [tickLength]);

  return {
    isAvg,
    toggleIsAvg,
    tickLength,
    setTickLength,
  };
};

export default useSettings;
