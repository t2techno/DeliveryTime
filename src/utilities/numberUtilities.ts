// n | 0
// quick floor function, I know that my numbers will function as 32bit, positive integers
export const printInt = (n: number) => {
  return padNumber(n | 0);
};

export const padNumber = (n: number) => {
  return n >= 10 ? "" + n : "0" + n;
};

// print convenience
// ms: number
export const msToTimeStr = (ms?: number) => {
  console.log(ms);
  if (ms === undefined) {
    return "--:--";
  }

  const sec = ms / 1000;
  const min = sec / 60;
  const hr = min / 60;
  const out =
    hr >= 1
      ? `${printInt(hr)}:${printInt(min % 60)}:${printInt(sec % 60)}`
      : `${printInt(min)}:${printInt(sec % 60)}`;

  return out;
};