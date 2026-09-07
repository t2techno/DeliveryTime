import { useCallback, useContext, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import styles from "./settings-popover.module.css";
import SettingsContext from "../../providers/settings/SettingsContext";
import ResetDialog from "../ResetDialog";
import { Settings } from "../Icons";
import X from "../Icons/X";
import DbContext from "../../providers/db/DbContext";

const SettingsPopover = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const { tickLength, setTickLength, avgSize, setAvgSize } =
    useContext(SettingsContext);
  const {
    stats: { numContractions },
  } = useContext(DbContext);

  const toggleOpen = useCallback(() => {
    setSettingsOpen((current) => !current);
  }, []);

  const close = useCallback(() => {
    setSettingsOpen(false);
  }, []);

  return (
    <Popover.Root
      open={settingsOpen}
      onOpenChange={(isOpen) => {
        setSettingsOpen(isOpen);
      }}
    >
      <Popover.Trigger asChild>
        <button
          className={styles.openButton}
          aria-label="Open Settings"
          onClick={toggleOpen}
        >
          <Settings />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.wrapper} sideOffset={5}>
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
              <p>{tickLength === 1 ? "Second" : "Seconds"}</p>
            </div>
            {tickLength === 0 && (
              <p className={styles.zeroTimeText}>Only display start time</p>
            )}
            {/* ToDo: input width fix, average all message fix */}
            <div>
              <label htmlFor="avgSizeInput">Average Size: </label>
              <input
                type="number"
                id="avgSizeInput"
                name="avgSizeInput"
                value={avgSize}
                min={0}
                max={numContractions}
                onChange={(e) => {
                  setAvgSize(Number(e.target.value));
                }}
              />
              {avgSize === 0 && <p>Average of all contractions</p>}
            </div>
          </div>
          <Popover.Close className={styles.closeButton} aria-label="Close">
            <X />
          </Popover.Close>
          <Popover.Arrow className={styles.popoverArrow} />
          <ResetDialog
            isOpen={resetDialogOpen}
            onOpenChange={setResetDialogOpen}
            onReset={close}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default SettingsPopover;
