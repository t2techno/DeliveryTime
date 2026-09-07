import Card from "../Card";
import LaborSection from "../LaborSection";
import TimeCard from "../TimeCard";
import { Contraction as ContractionIcon } from "../../components/Icons";
import styles from "./contraction-section.module.css";
import { useContext } from "react";
import DbContext from "../../providers/db/DbContext";
import { msToTimeStr } from "../../utilities/utilities";
import SettingsContext from "../../providers/settings/SettingsContext";

const ContractionSection = () => {
  const {
    lastContraction,
    stats: {
      numContractions,
      lastFullContractionLength,
      avgContractionLength,
      timeBetweenLastTwoContractions,
      avgTimeBetweenContractions,
    },
    updateContraction,
  } = useContext(DbContext);

  const { avgSize } = useContext(SettingsContext);
  const avgAmount = numContractions > avgSize ? avgSize : numContractions;

  return (
    <div className={styles.body}>
      <div className={styles.row}>
        <TimeCard
          label={"Length of contractions"}
          icon="timer"
          exact={msToTimeStr(lastFullContractionLength)}
          avg={msToTimeStr(avgContractionLength)}
          avgSize={avgAmount}
        />
        <TimeCard
          label={"Time between contractions"}
          icon="interval"
          exact={msToTimeStr(timeBetweenLastTwoContractions)}
          avg={msToTimeStr(avgTimeBetweenContractions)}
          avgSize={avgAmount}
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
