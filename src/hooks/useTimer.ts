import { useContext, useEffect, useRef, useState } from "react";
import { SettingsContext } from "../providers/settings/SettingsProvider";
import type { ContractionStore } from "../providers/db/db";

export interface TimerData {
  timeElapsed: number;
}

interface UseTimerValue {
  tickLength: number;
  timeElapsed: number;
  stopTimer: (time?: number) => void;
}

export const useTimer = (lastContraction?: ContractionStore): UseTimerValue => {
  const [timerStarted, setTimerStarted] = useState(
    lastContraction?.contraction.length === 1,
  );
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { tickLength } = useContext(SettingsContext);
  const timerIdRef = useRef(-1);
  const currentTickLength = useRef(tickLength);

  useEffect(() => {
    if (!lastContraction) {
      return;
    }

    const onTick = () => {
      const now = new Date().getTime();
      const then = lastContraction?.contraction[0] ?? now;
      setTimeElapsed(Math.floor((now - then) / 1000));
    };

    const stopTimer = () => {
      window.clearInterval(timerIdRef.current);
      timerIdRef.current = -1;
      setTimeElapsed(0);
      setTimerStarted(false);
    };

    if (timerStarted) {
      if (timerIdRef.current < 0) {
        timerIdRef.current = window.setInterval(onTick, tickLength * 1000);
      } else if (
        lastContraction.contraction.length === 2 &&
        timerIdRef.current > 0
      ) {
        stopTimer();
      } else if (currentTickLength.current !== tickLength) {
        window.clearInterval(timerIdRef.current);
        currentTickLength.current = tickLength;
        timerIdRef.current = window.setInterval(onTick, tickLength * 1000);
      }
    }

    return () => {
      window.clearInterval(timerIdRef.current);
      timerIdRef.current = -1;
    };
  }, [timerStarted, tickLength]);

  return {
    timeElapsed,
  };
};
