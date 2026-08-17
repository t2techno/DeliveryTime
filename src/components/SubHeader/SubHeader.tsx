import { useContext } from "react";
import styles from "./sub-header.module.css";
import DbContext from "../../providers/db/DbContext";
import { Clock } from "../Icons";

const SubHeader = () => {
  const { laborStart } = useContext(DbContext);

  return (
    <div className={styles.laborStart}>
      <div className={styles.row}>
        <Clock />
        <h2 className={styles.laborBegan}>Labor began</h2>
      </div>
      <p className="large-font">
        {laborStart > 0 ? new Date(laborStart).toLocaleString() : "--:--"}
      </p>
    </div>
  );
};

export default SubHeader;
