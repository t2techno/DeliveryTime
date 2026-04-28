import { useState } from "react";
import { useTimer } from "./hooks/useTimer";
import { msToTimeStr } from "./utilities/utilities";
import "./App.css";
import styles from "./app.module.css";

interface Contraction {
  start: number;
  end?: number;
}

type EnergyCategory = "food" | "drink";

const emptyTime = "--:--";

const getTimeBetween = (contractions: Array<Contraction>) => {
  if (contractions.length < 2) {
    return emptyTime;
  }

  const a = contractions.at(-1);
  const b = contractions.at(-2);

  if (a === undefined || b === undefined) {
    return emptyTime;
  }

  return msToTimeStr(a.start - b.start);
};

const getLaborStart = (contractions: Array<Contraction>) => {
  return contractions.length > 0
    ? new Date(contractions[0].start).toLocaleString()
    : emptyTime;
};

const getLastFullContraction = (
  contractions: Array<Contraction>,
): Contraction | undefined => {
  if (contractions.length === 0 || contractions[0].end === undefined) {
    return undefined;
  }

  const lastContraction = contractions.at(-1);
  console.log("lastContraction", lastContraction);

  return lastContraction?.end !== undefined
    ? lastContraction
    : contractions.at(-2);
};

const contractionLength = (contraction: Contraction | undefined): number => {
  console.log("checking length on:", contraction);
  if (contraction === undefined) {
    return -1;
  }

  const answer =
    contraction?.end === undefined
      ? new Date().getTime() - contraction.start
      : contraction.end - contraction.start;

  console.log("answer:", answer);

  return answer;
};

const getLastFullContractionLength = (
  contractions: Array<Contraction>,
): string => {
  console.log("checking contractions", contractions);
  const lastFullContraction = getLastFullContraction(contractions);
  const lastContractionLength = contractionLength(lastFullContraction);

  return lastContractionLength > 0
    ? msToTimeStr(lastContractionLength)
    : emptyTime;
};

const getLastContractionStart = (contractions: Array<Contraction>) => {
  if (contractions.length === 0) {
    return emptyTime;
  }

  const lastContraction = contractions.at(-1);
  return lastContraction === undefined
    ? emptyTime
    : new Date(lastContraction.start).toLocaleTimeString();
};

function App() {
  const { startTime, tickLength, timeElapsed, startTimer, stopTimer } =
    useTimer();

  const [contractions, setContractions] = useState<Array<Contraction>>([]);
  const [drink, setDrink] = useState<Array<number>>([]);
  const [food, setFood] = useState<Array<number>>([]);

  console.log("contractions:", contractions);

  const isRunning = startTime > 0;

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
      <div className={styles.laborWrapper}>
        <div className={styles.laborSection}>
          <h3>Labor Info</h3>
          <p>Labor Began: {getLaborStart(contractions)}</p>
          <p>Number of Contractions: {contractions.length}</p>
          <p>Time Between Contractions: {getTimeBetween(contractions)}</p>
        </div>
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
              isRunning ? handleTimerStop() : handleTimerStart();
            }}
          >
            {isRunning ? "Stop" : "Start"}
          </button>
        </div>
      </div>

      <div>
        <h2>Energy Info</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p>Last Food: {lastEnergyString("food")}</p>
            <button onClick={() => handleEnergy("food")}>+Food</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <p>Last Drink: {lastEnergyString("drink")}</p>
            <button onClick={() => handleEnergy("drink")}>+ Drink</button>
          </div>
        </div>
      </div>

      {/* <div>Medicine Stuff Reminders?</div> */}
    </>
  );
}

export default App;
