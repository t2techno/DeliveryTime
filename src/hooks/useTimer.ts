import { useCallback, useContext, useRef, useState } from "react";
import SettingsContext from "../providers/settings/SettingsContext";
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
    const then = lastContraction?.start ?? now;
    setTimeElapsed(Math.floor((now - then) / 1000));
  }, [lastContraction]);

  const stopTimer = () => {
    window.clearInterval(timerIdRef.current);
    timerIdRef.current = -1;
    setTimeElapsed(0);
  };

  if (lastContraction && tickLength > 0) {
    if (!lastContraction?.end && timerIdRef.current < 0) {
      timerIdRef.current = window.setInterval(
        onTick,
        currentTickLength.current * 1000,
      );
      // if the page is refreshed with a contraction running
      onTick();
    } else if (lastContraction?.end && timerIdRef.current > 0) {
      stopTimer();
    } else if (currentTickLength.current !== tickLength) {
      window.clearInterval(timerIdRef.current);
      // I could technically keep the inter-time difference and continue the same cadence
      // todo: keep the timing consistent
      currentTickLength.current = tickLength;
      timerIdRef.current = window.setInterval(
        onTick,
        currentTickLength.current * 1000,
      );
    }
  } else if (tickLength === 0 && timerIdRef.current > 0) {
    // This means we had the ticklength changed to 0 during timer
    // update tickLength ref and stop timer
    currentTickLength.current = tickLength;
    stopTimer();
  }

  return {
    timeElapsed,
  };
};
