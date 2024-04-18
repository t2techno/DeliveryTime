import React from "react";

interface ValueOut {
  time: number;
  updateTime: (time: number) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
}

const useTimer = (): ValueOut => {
  const [time, setTime] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);

  React.useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timerId = window.setInterval(() => {
      setTime((state) => state + 1);
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [isRunning]);

  const updateTime = React.useCallback((time: number) => {
    setTime(time);
    setIsRunning(true);
  }, []);

  const toggleTimer = React.useCallback(() => {
    setIsRunning((isRunning) => !isRunning);
  }, []);

  const resetTimer = React.useCallback(() => {
    console.log("resetting timer");
    setTime(0);
    setIsRunning(false);
  }, []);

  return { time, updateTime, toggleTimer, resetTimer };
};

export default useTimer;
