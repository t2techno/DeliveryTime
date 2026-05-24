import { useState } from "react";
import { useTimer } from "./hooks/useTimer";
import { emptyTime, type Contraction } from "./utilities/dataUtilities";
import LaborSection from "./components/LaborSection";
import HumanSection, { type EnergyCategory } from "./components/HumanSection";
import styles from "./app.module.css";
import TimeCard from "./components/TimeCard";
import Card from "./components/Card";
import { Clock } from "./components/Icons/Clock";
import {
  CenterHeart,
  Contraction as ContractionIcon,
  Settings,
} from "./components/Icons";

function App() {
  const { startTime, tickLength, timeElapsed, startTimer, stopTimer } =
    useTimer();

  const [contractions, setContractions] = useState<Array<Contraction>>([]);
  const [drink, setDrink] = useState<Array<number>>([]);
  const [food, setFood] = useState<Array<number>>([]);

  const handleTimerStart = () => {
    const now = new Date();
    setContractions((current) => [...current, { start: now.getTime() }]);
    startTimer(now.getTime());
  };

  const handleTimerStop = () => {
    const now = new Date();
    setContractions((current) => {
      const next = [...current];
      next[next.length - 1].end = now.getTime();
      return next;
    });
    stopTimer();
  };

  const handleEnergy = (category: EnergyCategory) => {
    const now = new Date();
    if (category === "food") {
      setFood((current) => [...current, now.getTime()]);
    } else {
      setDrink((current) => [...current, now.getTime()]);
    }
  };

  const lastEnergyString = (category: EnergyCategory) => {
    if (category === "food") {
      const lastFood = food.at(-1);
      return lastFood !== undefined
        ? new Date(lastFood).toLocaleTimeString()
        : emptyTime;
    } else {
      const lastDrink = drink.at(-1);
      return lastDrink !== undefined
        ? new Date(lastDrink).toLocaleTimeString()
        : emptyTime;
    }
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
          <p>Today, 6:00 AM</p>
        </div>
        <div className={styles.body}>
          <div className={styles.row}>
            <p>Average</p>
            <p>Exact</p>
          </div>
          <div className={styles.row}>
            <TimeCard
              label={"Time between last two contractions"}
              icon="interval"
            />
            <TimeCard label={"Length of last contraction"} icon="timer" />
          </div>
          <Card>
            <div className={styles.totalContractionLabel}>
              <ContractionIcon />
              <p>Total Contractions:</p>
            </div>
            <p>{contractions.length}</p>
          </Card>
          <LaborSection
            contractions={contractions}
            timerData={{ timeElapsed, startTime }}
            startTimer={handleTimerStart}
            stopTimer={handleTimerStop}
          />
        </div>

        <HumanSection
          handleEnergy={handleEnergy}
          lastDrink={lastEnergyString("drink")}
          lastFood={lastEnergyString("food")}
        />
      </div>
    </>
  );
}

export default App;
