import React from "react";

interface ValueOut {
  time: number;
  isRunning: boolean;
  startTimer: (initTime?: number) => void;
  resetTimer: () => void;
}

export const TIME_KEY = "start-time";
const useTimer = (): ValueOut => {
  const [time, setTime] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [alreadyExists, setAlreadyExists] = React.useState(false);

  React.useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timerId = window.setInterval(() => {
      setTime((state) => state + 1);
    }, 1000);
    if (!alreadyExists) {
      console.log("setting first timer");
      window.localStorage.setItem(TIME_KEY, new Date().getTime().toString());
    } else {
      console.log("not setting start time, already exists");
    }

    return () => {
      window.clearInterval(timerId);
    };
  }, [isRunning]);

  const startTimer = React.useCallback((initTime = 0) => {
    console.log("starting timer");
    setTime(Math.round(initTime));
    setAlreadyExists(initTime != 0);
    setIsRunning(true);
  }, []);

  const resetTimer = React.useCallback(() => {
    console.log("resetting timer");
    setTime(0);
    setIsRunning(false);
  }, []);

  return { time, isRunning, startTimer, resetTimer };
};

export default useTimer;
