import { useCallback, useContext } from "react";
import { secToTimeStr } from "../../utilities/utilities";
import styles from "./labor-section.module.css";
import SettingsContext from "../../providers/settings/SettingsContext";
import { useTimer } from "../../hooks/useTimer";
import type { ContractionStore } from "../../providers/db/db";

interface LaborSectionProps {
  lastContraction?: ContractionStore;
  updateContraction: () => void;
}

const LaborSection: React.FC<LaborSectionProps> = ({
  lastContraction,
  updateContraction,
}) => {
  // todo: start/stop icons
  const { tickLength } = useContext(SettingsContext);

  const { timeElapsed } = useTimer(lastContraction);
  const isRunning = lastContraction && lastContraction?.end === undefined;

  const getDisplayTime = useCallback(
    (timeElapsed: number) => {
      if (!isRunning) {
        return "--:--";
      }

      // LastContraction will always exist at this point
      // return contraction start time if ticklength is 0
      if (lastContraction && tickLength === 0) {
        return new Date(lastContraction.start).toLocaleString();
      }

      return secToTimeStr(timeElapsed);
    },
    [isRunning, lastContraction, tickLength],
  );

  return (
    <div className={styles.wrapper}>
      <h2>Current Contraction</h2>
      <p className={styles.bigTime}>{getDisplayTime(timeElapsed)}</p>
      <p>{isRunning ? "timer running" : ""}</p>
      <button
        className={`${styles.mainButton} ${isRunning ? styles.running : ""}`}
        onClick={updateContraction}
      >
        {isRunning ? "End Contraction" : "Start Contraction"}
      </button>
    </div>
  );
};

export default LaborSection;
