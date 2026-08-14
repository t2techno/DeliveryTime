import HumanSection from "./components/HumanSection";
import styles from "./app.module.css";
import { Clock } from "./components/Icons/Clock";
import { CenterHeart, Settings } from "./components/Icons";
import useDb from "./hooks/useDb";
import ContractionSection from "./components/ContractionSection";

function App() {
  const { laborStart } = useDb();

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
        <ContractionSection />
        <HumanSection />
      </div>
    </>
  );
}

export default App;
