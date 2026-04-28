import { useEffect, useRef, useState } from "react";

interface UseTimerValue {
  startTime: number;
  tickLength: number;
  timeElapsed: number;
  startTimer: (time?: number) => void;
  stopTimer: (time?: number) => void;
}

export const useTimer = (): UseTimerValue => {
  const [startTime, setStartTime] = useState(-1);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [tickLength, setTickLength] = useState(1);
  const timerIdRef = useRef(-1);

  useEffect(() => {
    if (startTime < 0) {
      return;
    }

    const onTick = () => {
      setTimeElapsed(Math.floor((new Date().getTime() - startTime) / 1000));
    };

    if (timerIdRef.current < 0) {
      timerIdRef.current = window.setInterval(onTick, tickLength * 1000);
    }

    return () => {
      window.clearInterval(timerIdRef.current);
    };
  }, [startTime]);

  const startTimer = (time?: number) => {
    setStartTime(time ?? new Date().getTime());
    setTimeElapsed(0);
  };

  const stopTimer = () => {
    window.clearInterval(timerIdRef.current);
    timerIdRef.current = -1;
    setStartTime(-1);
  };

  return {
    startTime,
    timeElapsed,
    tickLength,
    startTimer,
    stopTimer,
  };
};
