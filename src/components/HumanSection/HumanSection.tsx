import { useContext } from "react";
import { emptyTime } from "../../utilities/dataUtilities";
import Card from "../Card";
import { Apple } from "../Icons/Apple";
import { Drop } from "../Icons/Drop";
import styles from "./human-section.module.css";
import { DbContext } from "../../providers/db/DbProvider";

const msToTimeString = (time: number) => {
  return time > 0 ? new Date(time).toLocaleTimeString() : emptyTime;
};

const HumanSection = () => {
  const { lastFood, lastDrink, updateEnergy } = useContext(DbContext);
  return (
    <Card className={styles.card}>
      <div className={styles.grid}>
        <div className={`${styles.info} ${styles.food}`}>
          <Apple className={styles.food} /> {msToTimeString(lastFood)}
        </div>
        <div className={`${styles.info} ${styles.drink}`}>
          <Drop className={styles.drink} /> {msToTimeString(lastDrink)}
        </div>
        <button
          className={`${styles.button} ${styles.food}`}
          onClick={() => updateEnergy("food")}
        >
          <Apple className={styles.food} />
          Add Food
        </button>
        <button
          className={`${styles.button} ${styles.drink}`}
          onClick={() => updateEnergy("drink")}
        >
          <Drop className={styles.drink} />
          Add Drink
        </button>
      </div>
    </Card>
  );
};

export default HumanSection;
