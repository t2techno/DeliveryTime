import { CenterHeart } from "../Icons";
import SettingsPopover from "../SettingsPopover";
import styles from "./app-header.module.css";

const AppHeader = () => {
  return (
    <div className={styles.header}>
      <CenterHeart />
      <h1>Labor Timer</h1>
      <SettingsPopover />
    </div>
  );
};

export default AppHeader;
