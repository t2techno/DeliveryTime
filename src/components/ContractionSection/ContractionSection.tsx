import { useContext, useState } from "react";
import Card from "../Card";
import LaborSection from "../LaborSection";
import TimeCard from "../TimeCard";
import { Contraction as ContractionIcon } from "../../components/Icons";
import DbContext from "../../providers/db/DbContext";
import { msToTimeStr } from "../../utilities/utilities";
import SettingsContext from "../../providers/settings/SettingsContext";
import CollapsibleCard from "../Card/Collapsible";
import styles from "./contraction-section.module.css";
import ContractionData from "../ContractionData/ContractionData";

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
  const [dataIsOpen, setDataIsOpen] = useState(true);

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
      <LaborSection
        lastContraction={lastContraction}
        updateContraction={updateContraction}
      />
      <CollapsibleCard
        isOpen={dataIsOpen}
        onChange={(isOpen: boolean) => {
          console.log("open change. New val: ", isOpen);
          setDataIsOpen(isOpen);
        }}
        HeaderContent={
          <Card className={styles.totalCard}>
            <div className={styles.totalContractionLabel}>
              <ContractionIcon />
              <p>Total Contractions:</p>
              <p>{numContractions}</p>
            </div>
            <button onClick={() => setDataIsOpen((open) => !open)}>
              {dataIsOpen ? "X" : "O"}
            </button>
          </Card>
        }
      >
        <ContractionData />
      </CollapsibleCard>
    </div>
  );
};

export default ContractionSection;
