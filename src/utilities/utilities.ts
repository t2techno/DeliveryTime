import type { ContractionStore } from "../providers/db/db";

export const emptyTime = "--:--";

/******************************** */
/* Printing convenience functions */
/******************************** */
// n | 0
// quick floor function, I know that my numbers will function as 32bit, positive integers
export const printInt = (n: number): string => {
  const rounded = n < 0 ? Math.ceil(n) : Math.floor(n);
  if (rounded < 0 || rounded >= 10) {
    return `${rounded}`;
  }

  return `0${rounded}`;
};

// print convenience

export const timePiecesToStr = (hr: number, min: number, sec: number) => {
  let finalSec = sec;
  let finalMin = min;
  let finalHr = hr;

  if (finalSec >= 60) {
    finalMin += Math.floor(finalSec / 60);
    finalSec = finalSec % 60;
  }

  if (finalMin >= 60) {
    finalHr += Math.floor(finalMin / 60);
    finalMin = finalMin % 60;
  }

  return finalHr >= 1
    ? `${printInt(finalHr)}:${printInt(finalMin)}:${printInt(finalSec)}`
    : `${printInt(finalMin)}:${printInt(finalSec)}`;
};

export const secToTimeStr = (sec?: number) => {
  if (!sec || sec < 0) {
    return "00:00";
  }

  const min = sec / 60;
  const hr = min / 60;
  return timePiecesToStr(hr, min % 60, sec % 60);
};

export const msToTimeStr = (ms?: number) => {
  if (!ms || ms === -1) {
    return "00:00";
  }

  return secToTimeStr(ms / 1000);
};

/******************************** */
/* Calculation convenience functions */
/******************************** */

export const getTimeBetween = (a?: ContractionStore, b?: ContractionStore) => {
  if (a === undefined || b === undefined || a.start < 0 || b.start < 0) {
    return 0;
  }

  return a.start < b.start ? b.start - a.start : a.start - b.start;
};

export const getLaborStart = (contractions?: Array<ContractionStore>) => {
  if (!contractions || contractions.length === 0) {
    return emptyTime;
  }

  return new Date(contractions[0].start);
};

export const getLastFullContraction = (
  contractions?: Array<ContractionStore>,
): ContractionStore | undefined => {
  if (
    !contractions ||
    contractions.length === 0 ||
    contractions[0].end === undefined
  ) {
    return undefined;
  }

  const lastContraction = contractions.at(-1);

  return lastContraction?.end !== undefined
    ? lastContraction
    : contractions.at(-2);
};

export const getContractionLength = (
  contraction?: ContractionStore,
): number => {
  if (
    contraction === undefined ||
    (contraction?.end && contraction?.end < contraction.start)
  ) {
    return 0;
  }

  if (!contraction.end) {
    return new Date().getTime() - contraction.start;
  }

  return contraction.end - contraction.start;
};

export const getLastFullContractionLength = (
  contractions?: Array<ContractionStore>,
): number => {
  if (!contractions) {
    return 0;
  }
  const lastFullContraction = getLastFullContraction(contractions);
  return getContractionLength(lastFullContraction);
};

export const getLastContractionStart = (
  contractions?: Array<ContractionStore>,
): number => {
  if (!contractions || contractions.length === 0) {
    return 0;
  }

  const lastContraction = contractions.at(-1);
  return lastContraction === undefined ? 0 : lastContraction.start;
};

export const getAvgContractionLength = (
  contractions?: Array<ContractionStore>,
  avgSize: number = 5,
) => {
  if (!contractions || contractions.length === 0) {
    return 0;
  }

  // avgSize of 0 means we include all values in calculation
  // if there are less than avgSize, we need all of them anyway
  if (avgSize === 0 || contractions.length < avgSize) {
    const sum = contractions.reduce(
      (avg, val) => avg + getContractionLength(val),
      0,
    );
    return sum / contractions.length;
  }

  const lengthSum = contractions
    .slice(contractions.length - avgSize)
    .reduce((avg, val) => avg + getContractionLength(val), 0);
  return lengthSum / avgSize;
};

export const getAvgTimeBetween = (
  contractions?: Array<ContractionStore>,
  avgSize: number = 5,
) => {
  if (!contractions || contractions.length < 2) {
    return 0;
  }

  let trimmedList = contractions;
  let divisor = contractions.length - 1;

  // 5 time-between requires 6 contractions, so contraction length needs avgSize+1 length
  if (avgSize > 0 && contractions.length > avgSize) {
    trimmedList = contractions.slice(contractions.length - avgSize - 1);
    divisor = avgSize;
  }

  const betweenSum = trimmedList.reduce(
    (sum, contraction, idx) =>
      idx < trimmedList.length - 1
        ? sum + (trimmedList[idx + 1].start - contraction.start)
        : sum,
    0,
  );

  return betweenSum / divisor;
};
