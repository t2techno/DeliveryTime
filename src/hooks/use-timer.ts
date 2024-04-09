import React from "react";

type TimerReturn = [number, () => void, () => void, Date];

export const INIT_TIME = new Date(0);

const useTimer = (): TimerReturn => {
  const KEY = "main-timer";
  const [time, setTime] = React.useState(() => {
    const savedTime = window.localStorage.getItem(KEY);
    return savedTime != null
      ? Math.round(new Date().getTime() - new Date(savedTime).getTime() / 1000)
      : 0;
  });
  const [isRunning, setIsRunning] = React.useState(time != 0);
  const [startTime, setStartTime] = React.useState<Date>(INIT_TIME);

  React.useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timerId = window.setInterval(() => {
      setTime((state) => state + 1);
    }, 1000);
    window.localStorage.setItem(KEY, new Date().getTime().toString());

    return () => {
      window.clearInterval(timerId);
      window.localStorage.removeItem(KEY);
    };
  }, [isRunning]);

  const toggleTimer = React.useCallback(() => {
    setIsRunning((isRunning) => !isRunning);

    // only set new start time on initial run
    setStartTime((state) => {
      return state.getTime() == INIT_TIME.getTime() ? new Date() : state;
    });
  }, []);

  // ToDo: Add labor history to state before wiping
  const resetTimer = React.useCallback(() => {
    console.log("resetting timer");
    setTime(0);
    setStartTime(INIT_TIME);
    setIsRunning(false);
  }, []);

  return [time, toggleTimer, resetTimer, startTime];
};

export default useTimer;
