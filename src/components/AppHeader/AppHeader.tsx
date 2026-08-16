import { CenterHeart } from "../Icons";
import SettingsDialog from "../SettingsDialog";
import styles from "./app-header.module.css";

const AppHeader = () => {
  return (
    <div className={styles.header}>
      <CenterHeart />
      <h1>Labor Timer</h1>
      <SettingsDialog />
    </div>
  );
};

export default AppHeader;
