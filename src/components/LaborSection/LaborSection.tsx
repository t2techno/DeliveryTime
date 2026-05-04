import type { TimerData } from "../../hooks/useTimer";
import {
  getLaborStart,
  getTimeBetween,
  getLastContractionStart,
  getLastFullContractionLength,
  emptyTime,
  type Contraction,
} from "../../utilities/dataUtilities";
import Card from "../Card";
import styles from "./labor-section.module.css";

interface LaborSectionProps {
  contractions: Array<Contraction>;
  timerData: TimerData;
  startTimer: () => void;
  stopTimer: () => void;
}

const LaborSection: React.FC<LaborSectionProps> = ({
  contractions,
  timerData: { startTime, timeElapsed },
  startTimer,
  stopTimer,
}) => {
  const isRunning = startTime > 0;

  return (
    <div>
      <Card className={styles.laborInfo}>
        <h3>Labor Info</h3>
        <p>Labor Began: {getLaborStart(contractions)}</p>
        <p>Number of Contractions: {contractions.length}</p>
        <p>Time Between Contractions: {getTimeBetween(contractions)}</p>
      </Card>
      <Card>
        <div>
          <h3>Last Contraction</h3>
          <p>Time: {getLastContractionStart(contractions)}</p>
          <p>Length: {getLastFullContractionLength(contractions)}</p>
        </div>
        <div>
          <h3>Active Contraction</h3>
          <p>
            Start Time:{" "}
            {startTime > 0
              ? new Date(startTime).toLocaleTimeString()
              : emptyTime}
          </p>
          <p>Current Contraction: {isRunning ? timeElapsed : emptyTime}</p>
          <button
            onClick={() => {
              isRunning ? stopTimer() : startTimer();
            }}
          >
            {isRunning ? "Stop" : "Start"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default LaborSection;
