export const generateTimeDifString = (now: Date, then: Date) => {
  let time = now.getTime() - then.getTime();
  time = Math.floor(time / 1000);

  let minComp = Math.floor(time / 60);
  let secComp = time % 60;
  let outString = minComp == 0 ? "" : minComp.toString().padStart(2, "0");
  if (minComp == 1) {
    outString += " minute, ";
  } else if (minComp != 0) {
    outString += " minutes, ";
  }
  outString += secComp.toString().padStart(2, "0");
  outString += secComp == 1 ? " second" : " seconds";
  return outString;
};

export const generateTimeString = (seconds: number) => {
  let minComp = Math.floor(seconds / 60);
  let secComp = seconds % 60;
  let outString = minComp == 0 ? "" : minComp.toString().padStart(2, "0");
  if (minComp == 1) {
    outString += " minute, ";
  } else if (minComp != 0) {
    outString += " minutes, ";
  }
  outString += secComp.toString().padStart(2, "0");
  outString += secComp == 1 ? " second" : " seconds";
  return outString;
};

export const generateTime = (seconds: number) => {
  let hour = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  let min = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  let sec = (seconds % 60).toString().padStart(2, "0");

  if (hour == "00" && min == "00") {
    return sec;
  }

  if (hour == "00") {
    return `${min}:${sec}`;
  }

  return `${hour}:${min}:${sec}`;
};

// export const generateTime = (seconds: number) => {
//   let minComp = Math.floor(seconds / 60);
//   let secComp = seconds % 60;
//   let outString = minComp == 0 ? "" : minComp.toString().padStart(2, "0");
//   if (minComp == 1) {
//     outString += " minute, ";
//   } else if (minComp != 0) {
//     outString += " minutes, ";
//   }
//   outString += secComp.toString().padStart(2, "0");
//   outString += secComp == 1 ? " second" : " seconds";
//   return outString;
// };
