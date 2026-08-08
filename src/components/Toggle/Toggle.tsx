import { useCallback } from "react";
import styles from "./toggle.module.css";

interface ToggleProps {
  optionOne: string;
  optionTwo: string;
  currentValue: string;
  onChange: (newValue: string) => void;
}

const Toggle: React.FC<ToggleProps> = ({
  optionOne,
  optionTwo,
  currentValue,
  onChange,
}) => {
  const isActive = useCallback(
    (option: string) => {
      return currentValue === option;
    },
    [currentValue],
  );

  return (
    <div className={styles.wrapper}>
      <p
        className={`${styles.option} ${isActive(optionOne) ? styles.active : ""}`}
      >
        {optionOne}
      </p>
      <p
        className={`${styles.option} ${isActive(optionTwo) ? styles.active : ""}`}
      >
        {optionTwo}
      </p>
      <div className={styles.background} />
    </div>
  );
};

export default Toggle;
