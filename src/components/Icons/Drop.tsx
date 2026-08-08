import styles from "./icons.module.css";

export const Drop: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`${styles.circle} ${className ? className : ""}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16.5"
        height="24"
        version="1.1"
        viewBox="0 0 4.3657 6.35"
        className={styles.svg}
      >
        <g transform="translate(-101.04 -142.4)">
          <path
            d="m103.94 148.65c2.9536-0.2869 0.56187-4.9979-0.71349-6.1922-1.2754 1.1943-3.665 5.8849-0.71349 6.1922 0.57602 0.06 0.71349 0.0456 0.71349 0.0456s0.13747 0.0104 0.71349-0.0456z"
            fill="var(--drink)"
            stroke="var(--drink)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth=".11096"
          />
        </g>
      </svg>
    </div>
  );
};
