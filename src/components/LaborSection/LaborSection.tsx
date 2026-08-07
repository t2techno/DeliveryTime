import type { TimerData } from "../../hooks/useTimer";
import { secToTimeStr } from "../../utilities/numberUtilities";
import styles from "./labor-section.module.css";

interface LaborSectionProps {
  timerData: TimerData;
  startTimer: () => void;
  stopTimer: () => void;
}

const LaborSection: React.FC<LaborSectionProps> = ({
  timerData: { startTime, timeElapsed },
  startTimer,
  stopTimer,
}) => {
  const isRunning = startTime > 0;

  // todo: start/stop icons
  return (
    <div className={styles.wrapper}>
      <h2>Current Contraction</h2>
      <p className={styles.bigTime}>{secToTimeStr(timeElapsed)}</p>
      <p>{isRunning ? "timer running" : ""}</p>
      <button
        className={`${styles.mainButton} ${isRunning ? styles.running : ""}`}
        onClick={() => {
          isRunning ? stopTimer() : startTimer();
        }}
      >
        {isRunning ? "End Contraction" : "Start Contraction"}
      </button>
    </div>
  );
};

export default LaborSection;
