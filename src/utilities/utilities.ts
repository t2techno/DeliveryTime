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
    return emptyTime;
  }

  return msToTimeStr(a.start < b.start ? b.start - a.start : a.start - b.start);
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
    return -1;
  }

  if (!contraction.end) {
    return new Date().getTime() - contraction.start;
  }

  return contraction.end - contraction.start;
};

export const getLastFullContractionLength = (
  contractions?: Array<ContractionStore>,
): string => {
  if (!contractions) {
    return emptyTime;
  }
  const lastFullContraction = getLastFullContraction(contractions);
  const lastContractionLength = getContractionLength(lastFullContraction);

  return lastContractionLength > 0
    ? msToTimeStr(lastContractionLength)
    : emptyTime;
};

export const getLastContractionStart = (
  contractions?: Array<ContractionStore>,
) => {
  if (!contractions || contractions.length === 0) {
    return emptyTime;
  }

  const lastContraction = contractions.at(-1);
  return lastContraction === undefined
    ? emptyTime
    : new Date(lastContraction.start).toLocaleTimeString();
};
