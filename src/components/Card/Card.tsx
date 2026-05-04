import type { PropsWithChildren } from "react";
import styles from "./card.module.css";

interface CardProps {
  className?: string;
}

const Card: React.FC<PropsWithChildren<CardProps>> = ({
  className,
  children,
}) => (
  <div className={`${styles.wrapper} ${className ? className : ""}`}>
    {children}
  </div>
);

export default Card;
