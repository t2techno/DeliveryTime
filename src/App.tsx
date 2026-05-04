import { useState } from "react";
import { useTimer } from "./hooks/useTimer";
import { emptyTime, type Contraction } from "./utilities/dataUtilities";
import LaborSection from "./components/LaborSection";
import "./App.css";
import styles from "./app.module.css";
import HumanSection, { type EnergyCategory } from "./components/HumanSection";

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
        <LaborSection
          contractions={contractions}
          timerData={{ timeElapsed, startTime }}
          startTimer={handleTimerStart}
          stopTimer={handleTimerStop}
        />
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
