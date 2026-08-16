import { secToTimeStr } from "../../utilities/numberUtilities";
import styles from "./labor-section.module.css";

interface LaborSectionProps {
  timeElapsed: number;
  buttonAction: () => void;
  isRunning: boolean;
}

const LaborSection: React.FC<LaborSectionProps> = ({
  timeElapsed,
  isRunning,
  buttonAction
}) => {

  // todo: start/stop icons
  return (
    <div className={styles.wrapper}>
      <h2>Current Contraction</h2>
      <p className={styles.bigTime}>{secToTimeStr(timeElapsed)}</p>
      <p>{isRunning ? "timer running" : ""}</p>
      <button
        className={`${styles.mainButton} ${isRunning ? styles.running : ""}`}
        onClick={buttonAction}
      >
        {isRunning ? "End Contraction" : "Start Contraction"}
      </button>
    </div>
  );
};

export default LaborSection;
