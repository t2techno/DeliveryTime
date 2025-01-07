// element ids
const startTimeId = "start-time";
const numberOfId = "num-contractions";
const lengthId = "last-contract-length";
const timeBetweenId = "time-between";
const currentLengthId = "current-contract-length";
const contractButtonId = "contract-button";
const laborSectionId = "labor-info-wrapper";

const lastDrinkId = "last-drink";
const sinceLastDrinkId = "since-last-drink";
const lastFoodId = "last-food";
const sinceLastFoodId = "since-last-food";
const energySectionId = "energy-info-wrapper";

const settingsSectionsId = "settings-wrapper";
const sectionIds = [laborSectionId, energySectionId, settingsSectionsId];
// state
let isContracting = false;
let isAvg = false;
let avgWindow = 5;
let avgLength = 0;
let avgTimeBetween = 0;
let lastFood = 0;
let lastDrink = 0;

// would come from browser cookie
// const testHistory = [
//   [1736021681164, 1736021703852],
//   [1736021734451, 1736021760883],
//   [1736021808591, 1736021829778],
//   [1736022137140, 1736022230180],
//   [1736022422456, 1736022473224],
// ];

const testShort = [
  [1, 2],
  [3, 5],
  // [6]
];
const testMedium = [
  [1, 2],
  [3, 5],
  [6, 9],
  [10, 14],
  [15, 20],
  [21, 27],
  // [28]
];
const testLong = [
  [1, 2],
  [3, 5],
  [6, 9],
  [10, 14],
  [15, 20],
  [21, 27],
  [28, 32],
  [33, 40],
  [41, 50],
  [51, 60],
];

const contractionHistory = testLong; // = []; //[[startTime, endTime]]

// init from pre-saved data
const initState = () => {
  if (contractionHistory.length > 0) {
    updateNode(
      startTimeId,
      new Date(contractionHistory[0][0]).toLocaleString()
    );
    updateNode(numberOfId, contractionHistory.length);
    //debug
    contractionHistory.forEach((c) => console.log(`[${c[0]},${c[1]}]`));
    initAvgs();
    updateTimeSince(new Date().getTime());
    updateLengthNode();
    updateTimeBetweenNode();
  }
};
window.onload = initState;

// toggle display tabs
const displaySection = (section) => {
  sectionIds.forEach((id) => {
    if (section != id) {
      document.getElementById(id).classList.add("hidden");
    } else {
      document.getElementById(id).classList.remove("hidden");
    }
  });
};

// main toggle method
const toggleContraction = () => {
  const nowDate = new Date();
  const now = nowDate.getTime();
  // first contraction
  if (contractionHistory.length == 0) {
    console.log("first time");
    updateNode(startTimeId, nowDate.toLocaleString());
  }

  updateTimeSince(now);

  // start contraction
  if (!isContracting) {
    console.log("starting");
    isContracting = true;
    startContraction(now);
    updateNode(numberOfId, contractionHistory.length);
    updateNode(contractButtonId, "End Contraction");
  } else {
    console.log("stopping");
    isContracting = false;
    endContraction(now);
    updateNode(contractButtonId, "Start Contraction");
  }
};

const startContraction = (now) => {
  const numContractions = contractionHistory.push([now]);
  if (numContractions > 1) {
    updateTimeBetweenAvg();
    updateTimeBetweenNode();
  }
};

const endContraction = (now) => {
  const numContractions = contractionHistory.length;
  contractionHistory[numContractions - 1].push(now);
  updateLengthAvg();
  updateLengthNode();
};

const toggleAvgInfo = () => {
  console.log("toggle avg called");
  isAvg = !isAvg;
  updateLengthNode();
  updateTimeBetweenNode();
};

const getLatestIdx = () => {
  const numContractions = contractionHistory.length;
  if (numContractions === 0 || contractionHistory[0].length === 1) {
    return -1;
  }

  return contractionHistory[numContractions - 1].length > 1
    ? numContractions - 1
    : numContractions - 2;
};

const getContractionCount = () => {
  const numContractions = contractionHistory.length;
  if (numContractions == 0) {
    return 0;
  }

  return contractionHistory[numContractions - 1]?.length > 1
    ? numContractions
    : numContractions - 1;
};

const initAvgs = () => {
  // init tb
  const numContractions = contractionHistory.length;
  console.log(`numContractions: ${numContractions}`);
  if (numContractions > 1) {
    const numVals = Math.min(numContractions - 1, avgWindow);
    const startI = Math.max(numContractions - avgWindow, 1);
    console.log(`numTimeBetweens: ${numVals} - startI: ${startI}`);
    const avgSum = contractionHistory.slice(startI).reduce((sum, c, idx) => {
      console.log(
        `c[${startI + idx}]=${c[0]} - c[${startI + idx - 1}] = ${
          contractionHistory[startI + idx - 1][0]
        }`
      );
      return sum + c[0] - contractionHistory[startI + idx - 1][0];
    }, 0);
    avgTimeBetween = avgSum / numVals;
    console.log(`sum: ${avgSum} - avgTimeBetween: ${avgTimeBetween}`);
  }
  // init length
  const numFullContractions = getContractionCount();
  console.log(`number of full contractions: ${numFullContractions}`);

  const numVals = Math.min(numFullContractions, avgWindow);
  const startI = Math.max(numFullContractions - avgWindow, 0);
  console.log(`numContracts: ${numVals} - startI: ${startI}`);
  avgLength =
    contractionHistory.slice(startI, startI + numVals).reduce((sum, c) => {
      return sum + c[1] - c[0];
    }, 0) / numVals;

  console.log("avg length " + avgLength);
};

const updateLengthAvg = () => {
  const numContractions = contractionHistory.length;
  // we just do a normal avg until we have more than our window's length
  if (numContractions <= avgWindow) {
    avgLength =
      contractionHistory.reduce((sum, c) => {
        sum += c[1] - c[0];
      }, 0) / numContractions;
    return;
  }

  const newL = calcLength(contractionHistory[numContractions - 1]);
  const oldL = calcLength(contractionHistory[numContractions - avgWindow - 1]);
  avgLength += (newL - oldL) / avgWindow;
};

const calcLength = (c) => {
  return c[1] - c[0];
};

const updateTimeBetweenAvg = (tb) => {
  const numContractions = contractionHistory.length;
  // one less time-between than number of contractions
  if (numContractions - 1 <= avgWindow) {
    avgTimeBetween =
      contractionHistory.slice(1).reduce((sum, c, idx) => {
        sum += c[0] - contractionHistory[idx][0];
      }, 0) /
      (numContractions - 1);
    return;
  }

  const newTb =
    contractionHistory[numContractions - 1][0] -
    contractionHistory[numContractions - 2][0];

  const oldTb =
    contractionHistory[numContractions - avgWindow - 1][0] -
    contractionHistory[numContractions - avgWindow - 2][0];
  avgTimeBetween += (newTb - oldTb) / avgWindow;
};

// arr: number[]
const simpleAvg = (arr) => {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
};

// energy methods
const addFood = () => {
  const now = new Date();
  lastFood = now.getTime();
  updateNode(lastFoodId, now.toLocaleTimeString());
  updateTimeSince(now);
};

const addDrink = () => {
  const now = new Date();
  lastDrink = now.getTime();
  updateNode(lastDrinkId, now.toLocaleTimeString());
  updateTimeSince(now);
};

// utility methods

// ms: number
const msToMinuteStr = (ms) => {
  const sec = ms / 1000;
  const min = sec / 60;

  return `${printInt(min)}:${printInt(sec % 60)}`;
};

// ms: number
const msToHourStr = (ms) => {
  const sec = ms / 1000;
  const min = sec / 60;
  const hr = min / 60;
  const out =
    hr >= 1
      ? `${printInt(hr)}:${printInt(min % 60)}:${printInt(sec % 60)}`
      : `${printInt(min)}:${printInt(sec % 60)}`;

  return out;
};

const printInt = (n) => {
  return padNumber(n | 0);
};

const padNumber = (n) => {
  return n >= 10 ? "" + n : "0" + n;
};

const updateNode = (id, newText) => {
  document.getElementById(id).textContent = newText;
};

const updateLengthNode = () => {
  // no lengths to display
  if (contractionHistory.length == 0 || contractionHistory[0].length === 1)
    return;

  const newString = isAvg
    ? msToMinuteStr(avgLength)
    : msToMinuteStr(calcLength(contractionHistory[getLatestIdx()]));

  updateNode(lengthId, newString);
};

const updateTimeBetweenNode = () => {
  // nothing to display
  if (contractionHistory.length < 2) {
    return;
  }

  let newString = "";
  if (isAvg) {
    newString = msToMinuteStr(avgTimeBetween);
  } else {
    const timeBetween =
      contractionHistory[contractionHistory.length - 1][0] -
      contractionHistory[contractionHistory.length - 2][0];

    newString = msToHourStr(timeBetween);
  }

  updateNode(timeBetweenId, newString);
};

const updateTimeSince = (now) => {
  if (lastFood > 0) {
    updateNode(sinceLastFoodId, msToHourStr(now - lastFood) + " ago");
  }
  if (lastDrink > 0) {
    updateNode(sinceLastDrinkId, msToMinuteStr(now - lastDrink) + " ago");
  }
};
