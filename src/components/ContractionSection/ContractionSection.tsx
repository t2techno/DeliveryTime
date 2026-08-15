import { useTimer } from "../../hooks/useTimer";
import Card from "../Card";
import LaborSection from "../LaborSection";
import TimeCard from "../TimeCard";
import { Contraction as ContractionIcon } from "../../components/Icons";
import styles from "./contraction-section.module.css";
import { useContext } from "react";
import { DbContext } from "../../providers/db/DbProvider";

const ContractionSection = () => {
  const { numContractions, updateContraction, lastContraction } =
    useContext(DbContext);

  const { timeElapsed } = useTimer(lastContraction);
  return (
    <div className={styles.body}>
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
        isRunning={
          lastContraction ? lastContraction.contraction.length === 1 : false
        }
        timeElapsed={timeElapsed}
        buttonAction={updateContraction}
      />
    </div>
  );
};

export default ContractionSection;
