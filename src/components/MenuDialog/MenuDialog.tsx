import * as BaseDialog from "@radix-ui/react-dialog";
import { type PropsWithChildren } from "react";
import styles from "./menu-dialog.module.css";
import { Settings } from "../Icons";

interface iMenuDialog {
  isOpen: boolean;
  onOpenChange: () => void;
  className?: string;
}

const MenuDialog: React.FC<PropsWithChildren<iMenuDialog>> = ({
  children,
  isOpen,
  onOpenChange,
  className,
}) => {
  return (
    <BaseDialog.Root onOpenChange={onOpenChange} modal>
      <BaseDialog.Trigger asChild>
        <button aria-label="Open navigation menu" className={styles.triggerBtn}>
          <Settings className={styles.menu}/>
        </button>
      </BaseDialog.Trigger>
      <BaseDialog.Content
        className={`${styles.drawer} ${!isOpen && styles.closed} ${
          className && className
        }`}
      >
        <BaseDialog.Title className={styles.title}>Settings</BaseDialog.Title>
        {children}
        <BaseDialog.Close asChild>
          <button className={styles.closeBtn}>Close</button>
        </BaseDialog.Close>
      </BaseDialog.Content>
    </BaseDialog.Root>
  );
};

export default MenuDialog;
