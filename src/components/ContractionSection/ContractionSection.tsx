import Card from "../Card";
import LaborSection from "../LaborSection";
import TimeCard from "../TimeCard";
import { Contraction as ContractionIcon } from "../../components/Icons";
import styles from "./contraction-section.module.css";
import { useContext } from "react";
import DbContext from "../../providers/db/DbContext";
import { msToTimeStr } from "../../utilities/utilities";

const ContractionSection = () => {
  const {
    lastContraction,
    stats: {
      numContractions,
      lastFullContractionLength,
      timeBetweenLastTwoContractions,
    },
    updateContraction,
  } = useContext(DbContext);

  return (
    <div className={styles.body}>
      <div className={styles.row}>
        <TimeCard
          label={"Length of last contraction"}
          icon="timer"
          time={msToTimeStr(lastFullContractionLength)}
        />
        <TimeCard
          label={"Time between last two contractions"}
          icon="interval"
          time={msToTimeStr(timeBetweenLastTwoContractions)}
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
