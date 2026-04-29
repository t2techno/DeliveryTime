import { msToTimeStr } from "./numberUtilities";

export interface Contraction {
  start: number;
  end?: number;
}

export const emptyTime = "--:--";

export const getTimeBetween = (contractions: Array<Contraction>) => {
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

export const getLaborStart = (contractions: Array<Contraction>) => {
  return contractions.length > 0
    ? new Date(contractions[0].start).toLocaleString()
    : emptyTime;
};

export const getLastFullContraction = (
  contractions: Array<Contraction>,
): Contraction | undefined => {
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
  contraction: Contraction | undefined,
): number => {
  console.log("checking length on:", contraction);
  if (contraction === undefined) {
    return -1;
  }

  const answer =
    contraction?.end === undefined
      ? new Date().getTime() - contraction.start
      : contraction.end - contraction.start;

  console.log("answer:", answer);

  return answer;
};

export const getLastFullContractionLength = (
  contractions: Array<Contraction>,
): string => {
  console.log("checking contractions", contractions);
  const lastFullContraction = getLastFullContraction(contractions);
  const lastContractionLength = contractionLength(lastFullContraction);

  return lastContractionLength > 0
    ? msToTimeStr(lastContractionLength)
    : emptyTime;
};

export const getLastContractionStart = (contractions: Array<Contraction>) => {
  if (contractions.length === 0) {
    return emptyTime;
  }

  const lastContraction = contractions.at(-1);
  return lastContraction === undefined
    ? emptyTime
    : new Date(lastContraction.start).toLocaleTimeString();
};
