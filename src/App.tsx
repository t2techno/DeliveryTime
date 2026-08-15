import HumanSection from "./components/HumanSection";
import styles from "./app.module.css";
import { Clock } from "./components/Icons/Clock";
import { CenterHeart, Settings } from "./components/Icons";
import ContractionSection from "./components/ContractionSection";
import { useContext } from "react";
import { DbContext } from "./providers/db/DbProvider";

function App() {
  const { laborStart } = useContext(DbContext);

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
          <p>
            {laborStart > 0 ? new Date(laborStart).toLocaleString() : "--:--"}
          </p>
        </div>
        <ContractionSection />
        <HumanSection />
      </div>
    </>
  );
}

export default App;
