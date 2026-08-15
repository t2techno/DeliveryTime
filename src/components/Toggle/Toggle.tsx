import { useCallback } from "react";
import styles from "./toggle.module.css";

interface ToggleInput {
  label: string;
  value: string;
}

interface ToggleProps {
  optionOne: ToggleInput;
  optionTwo: ToggleInput;
  currentValue: string;
  toggleValue: () => void;
}

const Toggle: React.FC<ToggleProps> = ({
  optionOne,
  optionTwo,
  currentValue,
  toggleValue,
}) => {
  const isActive = useCallback(
    (option: string) => {
      return currentValue === option;
    },
    [currentValue],
  );

  return (
    <div
      className={styles.wrapper}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleValue();
      }}
    >
      {[optionOne, optionTwo].map(({ label, value }) => (
        <label
          key={`${value}-key`}
          htmlFor={label}
          className={`${styles.option} ${isActive(value) ? styles.active : styles.inactive}`}
        >
          {label}
          <input
            type="radio"
            id={label}
            className={styles.input}
            name={label}
            value={value}
            checked={isActive(value)}
            onChange={(e) => {
              // This will probably only be targeted by screen readers
              e.stopPropagation();
              e.preventDefault();
              toggleValue();
            }}
          />
        </label>
      ))}

      <div
        className={`${styles.background} ${isActive(optionOne.value) ? "" : styles.optionTwoBackground}`}
      />
    </div>
  );
};

export default Toggle;
