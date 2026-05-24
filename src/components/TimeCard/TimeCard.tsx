import type { JSX } from "react";
import Card from "../Card";
import { Interval } from "../Icons/Interval";
import { Timer } from "../Icons/Timer";
import styles from "./time-card.module.css";

type IconOption = "timer" | "interval";

interface TimeCardProps {
  label: string;
  icon: IconOption;
}

const iconMap: Record<IconOption, JSX.Element> = {
  timer: <Timer />,
  interval: <Interval />,
};

const TimeCard: React.FC<TimeCardProps> = ({ label, icon }) => {
  return (
    <Card>
      <div className={styles.row}>
        <h2 className={styles.label}>{label}</h2>
        <div className={styles.icon}>{iconMap[icon]}</div>
      </div>
      <p className={styles.time}>05:40</p>
      <p>avg</p>
    </Card>
  );
};

export default TimeCard;
