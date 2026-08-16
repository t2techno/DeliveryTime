import { useCallback, useContext, useRef, useState } from "react";
import { SettingsContext } from "../providers/settings/SettingsProvider";
import type { ContractionStore } from "../providers/db/db";

export interface TimerData {
  timeElapsed: number;
}

interface UseTimerValue {
  timeElapsed: number;
}

export const useTimer = (lastContraction?: ContractionStore): UseTimerValue => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { tickLength } = useContext(SettingsContext);
  const timerIdRef = useRef(-1);
  const currentTickLength = useRef(tickLength);

  const onTick = useCallback(() => {
    const now = new Date().getTime();
    const then = lastContraction?.contraction[0] ?? now;
    setTimeElapsed(Math.floor((now - then) / 1000));
  }, [lastContraction]);

  const stopTimer = () => {
    window.clearInterval(timerIdRef.current);
    timerIdRef.current = -1;
    setTimeElapsed(0);
  };

  if (lastContraction?.contraction.length === 1 && timerIdRef.current < 0) {
    timerIdRef.current = window.setInterval(onTick, tickLength * 1000);
  } else if (
    lastContraction?.contraction.length === 2 &&
    timerIdRef.current > 0
  ) {
    stopTimer();
  } else if (currentTickLength.current !== tickLength) {
    window.clearInterval(timerIdRef.current);
    // I could technically keep the inter-time difference and continue
    // todo: keep the timing consistent
    currentTickLength.current = tickLength;
    timerIdRef.current = window.setInterval(onTick, tickLength * 1000);
  }

  return {
    timeElapsed,
  };
};
