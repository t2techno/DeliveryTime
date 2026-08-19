import type { ContractionStore } from "../providers/db/db";
import { msToTimeStr } from "./numberUtilities";

export const emptyTime = "--:--";

export const getTimeBetween = (contractions: Array<ContractionStore>) => {
  if (contractions.length < 2) {
    return emptyTime;
  }

  const a = contractions.at(-1);
  const b = contractions.at(-2);

  if (a === undefined || b === undefined) {
    return emptyTime;
  }

  return msToTimeStr(a.start - b.start);
};

export const getLaborStart = (contractions: Array<ContractionStore>) => {
  return contractions.length > 0
    ? new Date(contractions[0].start).toLocaleString()
    : emptyTime;
};

export const getLastFullContraction = (
  contractions: Array<ContractionStore>,
): ContractionStore | undefined => {
  if (contractions.length === 0 || contractions[0].end === undefined) {
    return undefined;
  }

  const lastContraction = contractions.at(-1);
  console.log("lastContraction", lastContraction);

  return lastContraction?.end !== undefined
    ? lastContraction
    : contractions.at(-2);
};

export const contractionLength = (
  contraction: ContractionStore | undefined,
): number => {
  console.log("checking length on:", contraction);
  if (contraction === undefined) {
    return -1;
  }

  const answer =
    contraction?.end === undefined
      ? new Date().getTime() - contraction.start
      : contraction.end - contraction.start;

  console.log("contraction length:", answer);

  return answer;
};

export const getLastFullContractionLength = (
  contractions?: Array<ContractionStore>,
): string => {
  if (!contractions) {
    return emptyTime;
  }
  const lastFullContraction = getLastFullContraction(contractions);
  const lastContractionLength = contractionLength(lastFullContraction);

  return lastContractionLength > 0
    ? msToTimeStr(lastContractionLength)
    : emptyTime;
};

export const getLastContractionStart = (
  contractions: Array<ContractionStore>,
) => {
  if (contractions.length === 0) {
    return emptyTime;
  }

  const lastContraction = contractions.at(-1);
  return lastContraction === undefined
    ? emptyTime
    : new Date(lastContraction.start).toLocaleTimeString();
};
