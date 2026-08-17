import { useContext, useState } from "react";
import MenuDialog from "../MenuDialog";
import styles from "./settings-dialog.module.css";
import SettingsContext from "../../providers/settings/SettingsContext";
import ResetDialog from "../ResetDialog";

const SettingsDialog = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const { tickLength, setTickLength } = useContext(SettingsContext);

  return (
    <MenuDialog
      isOpen={settingsOpen}
      onOpenChange={() => {
        setSettingsOpen((current) => !current);
      }}
    >
      <div className={styles.settingsContent}>
        <h2 className="settingLabel" id="tick-length-label">
          Timer Update
        </h2>
        <div className={styles.tickLengthWrapper}>
          <p>Every &nbsp;</p>
          <input
            className={styles.tickLengthInput}
            type="number"
            min="0"
            max="60"
            value={tickLength}
            onChange={(e) => {
              setTickLength(Number(e.target.value));
            }}
          />
          <p>&nbsp;{tickLength === 1 ? "Second" : "Seconds"}</p>
        </div>
        {tickLength === 0 && (
          <p className={styles.zeroTimeText}>Only display start time</p>
        )}
      </div>
      <ResetDialog isOpen={resetDialogOpen} onOpenChange={setResetDialogOpen} />
    </MenuDialog>
  );
};

export default SettingsDialog;
