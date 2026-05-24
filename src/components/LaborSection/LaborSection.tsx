import type { TimerData } from "../../hooks/useTimer";
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
      <p className={styles.bigTime}>{timeElapsed}</p>
      <p>{isRunning ? "timer running" : ""}</p>
      <button
        onClick={() => {
          isRunning ? stopTimer() : startTimer();
        }}
      >
        {isRunning ? "Stop Contraction" : "Start Contraction"}
      </button>
    </div>
  );
};

export default LaborSection;
