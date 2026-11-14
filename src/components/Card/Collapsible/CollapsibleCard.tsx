import styles from "./collapsible-card.module.css";
import * as Collapsible from "@radix-ui/react-collapsible";

interface CollapsibleCardProps {
  isOpen: boolean;
  onChange: (isOpen: boolean) => void;
  HeaderContent: React.ReactNode;
}

const CollapsibleCard: React.FC<
  React.PropsWithChildren<CollapsibleCardProps>
> = ({ isOpen, onChange, HeaderContent, children }) => {
  return (
    <Collapsible.Root
      className={styles.root}
      open={isOpen}
      onOpenChange={(open: boolean) => onChange(open)}
    >
      {HeaderContent}
      <Collapsible.Content>{children}</Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CollapsibleCard;
