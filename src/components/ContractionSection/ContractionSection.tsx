import Card from "../Card";
import LaborSection from "../LaborSection";
import TimeCard from "../TimeCard";
import { Contraction as ContractionIcon } from "../../components/Icons";
import styles from "./contraction-section.module.css";
import { useContext } from "react";
import DbContext from "../../providers/db/DbContext";

const ContractionSection = () => {
  const { numContractions } = useContext(DbContext);
  const {
    lastContraction,
    lastFullContractionLength,
    timeBetweenLastTwoContractions,
    updateContraction,
  } = useContext(DbContext);

  return (
    <div className={styles.body}>
      <div className={styles.row}>
        <TimeCard
          label={"Time between last two contractions"}
          icon="interval"
          time={lastFullContractionLength}
        />
        <TimeCard
          label={"Length of last contraction"}
          icon="timer"
          time={timeBetweenLastTwoContractions}
        />
      </div>
      <Card className={styles.totalCard}>
        <div className={styles.totalContractionLabel}>
          <ContractionIcon />
          <p>Total Contractions:</p>
          <p>{numContractions}</p>
        </div>
      </Card>
      <LaborSection
        lastContraction={lastContraction}
        updateContraction={updateContraction}
      />
    </div>
  );
};

export default ContractionSection;
