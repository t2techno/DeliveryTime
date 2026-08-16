import { useState } from "react";
import MenuDialog from "../MenuDialog";
import styles from "./settings-dialog.module.css";

const SettingsDialog = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <MenuDialog
      isOpen={settingsOpen}
      onOpenChange={() => {
        setSettingsOpen((current) => !current);
      }}
    >
      <div className="settingContent">
        <h2 className="settingLabel" id="tick-length-label">
          Timer Update
        </h2>
        <div id="tick-length-wrapper">
          <p>Every &nbsp;</p>
          <input
            id="tick-length-input"
            type="number"
            min="0"
            max="60"
            value="1"
          />
          <p id="tick-length-seconds-text">&nbsp;Second</p>
        </div>
        <p id="no-tick-label" className={styles.hidden}>
          Only display start time
        </p>
      </div>
    </MenuDialog>
  );
};

export default SettingsDialog;
