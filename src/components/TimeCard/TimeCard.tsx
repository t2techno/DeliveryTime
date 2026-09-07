import { useContext, type JSX } from "react";
import Card from "../Card";
import { Interval } from "../Icons/Interval";
import { Timer } from "../Icons/Timer";
import styles from "./time-card.module.css";
import DbContext from "../../providers/db/DbContext";

type IconOption = "timer" | "interval";

interface TimeCardProps {
  exact: string;
  avg: string;
  avgSize: number;
  label: string;
  icon: IconOption;
}

const iconMap: Record<IconOption, JSX.Element> = {
  timer: <Timer />,
  interval: <Interval />,
};

const TimeCard: React.FC<TimeCardProps> = ({
  label,
  icon,
  exact,
  avg,
  avgSize,
}) => {
  return (
    <Card>
      <div className={styles.row}>
        <div className={styles.icon}>{iconMap[icon]}</div>

        <h2 className={styles.label}>{label}</h2>
      </div>
      <div className={styles.colGrid}>
        <div className={styles.avgCol}>
          <p>Last</p>
          <p className={styles.time}>{exact}</p>
        </div>

        <div className={styles.avgCol}>
          {avgSize > 1 && (
            <>
              <p>Average of last {avgSize}</p>
              <p className={styles.time}>{avg}</p>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TimeCard;
