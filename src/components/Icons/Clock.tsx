import styles from "./icons.module.css";

export const Clock = () => {
  // Todo: Make this responsive to actual time
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles.svg}
      id="clock"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        id="circle"
        fill="hsla(var(--primary-hsl), 20%)"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinecap="round"
        cx="12"
        cy="12"
        r="11"
      />
      <path
        id="hands"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2px"
        strokeLinecap="round"
        d="m 11.918426,4.3188182 0.06743,7.6296458 4.07906,1.890049"
      />
    </svg>
  );
};
