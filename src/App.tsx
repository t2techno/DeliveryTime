import { useTimer } from "./hooks/useTimer";
import LaborSection from "./components/LaborSection";
import HumanSection from "./components/HumanSection";
import styles from "./app.module.css";
import TimeCard from "./components/TimeCard";
import Card from "./components/Card";
import { Clock } from "./components/Icons/Clock";
import {
  CenterHeart,
  Contraction as ContractionIcon,
  Settings,
} from "./components/Icons";
import Toggle from "./components/Toggle";
import useSettings from "./hooks/useSettings";
import useDb from "./hooks/useDb";

function App() {
  const { startTime, timeElapsed, startTimer, stopTimer } = useTimer();

  const { isAvg, toggleIsAvg /*tickLength, setTickLength*/ } = useSettings();
  const {
    laborStart,
    numContractions,
    updateContraction,
    lastFood,
    lastDrink,
    updateEnergy,
  } = useDb();

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
    <>
      <div className={styles.pageWrapper}>
        <div className={styles.header}>
          <CenterHeart />
          <h1>Labor Timer</h1>
          <Settings />
        </div>
        <div className={styles.laborStart}>
          <div className={styles.row}>
            <Clock />
            <h2 className={styles.laborBegan}>Labor began</h2>
          </div>
          <p>{laborStart > 0 ? new Date(laborStart).getDate() : "--:--"}</p>
        </div>
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

        <HumanSection
          handleEnergy={updateEnergy}
          lastDrink={lastDrink}
          lastFood={lastFood}
        />
      </div>
    </>
  );
}

export default App;
