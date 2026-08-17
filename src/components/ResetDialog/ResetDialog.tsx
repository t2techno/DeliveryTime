import { useContext } from "react";
import * as BaseDialog from "@radix-ui/react-dialog";
import DbContext from "../../providers/db/DbContext";
import SettingsContext from "../../providers/settings/SettingsContext";
import styles from "./reset-alert.module.css";
import X from "../Icons/X";

interface ResetDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ResetDialog: React.FC<ResetDialogProps> = ({ isOpen, onOpenChange }) => {
  const { resetDb } = useContext(DbContext);
  const { resetSettings } = useContext(SettingsContext);

  const resetApp = () => {
    resetDb();
    resetSettings();
    onOpenChange(false);
  };

  return (
    <BaseDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <BaseDialog.Trigger asChild>
        <button
          aria-label="Reset app and delete labor data"
          className={styles.triggerBtn}
        >
          Reset App
        </button>
      </BaseDialog.Trigger>
      <BaseDialog.Portal>
        <BaseDialog.Overlay className={styles.overlay} />
        <BaseDialog.Content className={styles.contentWrapper}>
          <BaseDialog.Title className={styles.title}>
            Delete Labor Data
          </BaseDialog.Title>
          <p>
            Are you sure you'd like to delete all information about this labor?
          </p>
          <div className={styles.buttonRow}>
            <button
              autoFocus
              type="button"
              id="reset-button"
              className={styles.dialogButton}
              onClick={() => resetApp()}
            >
              Yes
            </button>
            <button
              type="button"
              id="close-dialog-button"
              className={styles.dialogButton}
              onClick={() => onOpenChange(false)}
            >
              No
            </button>
          </div>

          <BaseDialog.Close className={styles.closeButton} aria-label="Close">
            <X />
          </BaseDialog.Close>
        </BaseDialog.Content>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
};
export default ResetDialog;
