import useDb from "../../hooks/useDb";
import { useTimer } from "../../hooks/useTimer";
import Card from "../Card";
import LaborSection from "../LaborSection";
import TimeCard from "../TimeCard";
import Toggle from "../Toggle";
import { Contraction as ContractionIcon } from "../../components/Icons";
import styles from "./contraction-section.module.css";
import useSettings from "../../hooks/useSettings";

const ContractionSection = () => {
  const { isAvg, toggleIsAvg } = useSettings();
  const { startTime, timeElapsed, startTimer, stopTimer } = useTimer();

  const { numContractions, updateContraction } = useDb();

  const handleTimerStart = () => {
    const now = new Date();
    updateContraction();
    startTimer(now.getTime());
  };

  const handleTimerStop = () => {
    updateContraction();
    stopTimer();
  };

  return (
    <div className={styles.body}>
      <div className={`${styles.row} ${styles.toggle}`}>
        <Toggle
          optionOne={{ label: "Exact", value: "exact" }}
          optionTwo={{ label: "Average", value: "average" }}
          currentValue={isAvg ? "average" : "exact"}
          toggleValue={toggleIsAvg}
        />
      </div>
      <div className={styles.row}>
        <TimeCard
          label={"Time between last two contractions"}
          icon="interval"
        />
        <TimeCard label={"Length of last contraction"} icon="timer" />
      </div>
      <Card className={styles.totalCard}>
        <div className={styles.totalContractionLabel}>
          <ContractionIcon />
          <p>Total Contractions:</p>
          <p>{numContractions}</p>
        </div>
      </Card>
      <LaborSection
        timerData={{ timeElapsed, startTime }}
        startTimer={handleTimerStart}
        stopTimer={handleTimerStop}
      />
    </div>
  );
};

export default ContractionSection;
