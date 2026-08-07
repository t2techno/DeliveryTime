import Card from "../Card";
import { Apple } from "../Icons/Apple";
import { Drop } from "../Icons/Drop";
import styles from "./human-section.module.css";

export type EnergyCategory = "food" | "drink";

interface HumanSectionProps {
  handleEnergy: (type: EnergyCategory) => void;
  lastFood: string;
  lastDrink: string;
}

const HumanSection: React.FC<HumanSectionProps> = ({
  handleEnergy,
  lastFood,
  lastDrink,
}) => {
  return (
    <Card className={styles.card}>
      <div className={styles.grid}>
        <div className={`${styles.info} ${styles.food}`}>
          <Apple className={styles.food} /> {lastFood}
        </div>
        <div className={`${styles.info} ${styles.drink}`}>
          <Drop className={styles.drink} /> {lastDrink}
        </div>
        <button
          className={`${styles.button} ${styles.food}`}
          onClick={() => handleEnergy("food")}
        >
          <Apple className={styles.food} />
          Add Food
        </button>
        <button
          className={`${styles.button} ${styles.drink}`}
          onClick={() => handleEnergy("drink")}
        >
          <Drop className={styles.drink} />
          Add Drink
        </button>
      </div>
    </Card>
  );
};

export default HumanSection;
