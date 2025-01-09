// element ids
const startTimeId = "start-time";
const numberOfId = "num-contractions";
const lengthId = "contract-length";
const timeBetweenId = "time-between";
const activeLengthId = "active-length";
const activeStartId = "active-start";
const contractButtonTextId = "contract-button-text";
const buttonSymbolId = "contract-button-symbol";
const laborSectionId = "labor-info-wrapper";

const lastDrinkId = "last-drink";
const sinceLastDrinkId = "since-last-drink";
const lastFoodId = "last-food";

const timerSettingLabelId = "timer-setting-label";
const timerSettingId = "timer-setting";

const sinceLastFoodId = "since-last-food";
const energySectionId = "energy-info-wrapper";
const lowPowerSectionId = "low-power-wrapper";
const sectionIds = [laborSectionId, energySectionId, lowPowerSectionId];
// state
let isContracting = false;
let isAvg = false;
let intervalId = -1;
let tickLength = 1;
let avgWindow = 5;
let avgLength = 0;
let avgTimeBetween = 0;
let lastFood = 0;
let lastDrink = 0;

// would come from browser cookie
const testHistory = [
  [1736021681164, 1736021703852],
  [1736021734451, 1736021760883],
  [1736021808591, 1736021829778],
  [1736022137140, 1736022230180],
  [1736022422456, 1736022473224],
];

const contractionHistory = []; //[[startTime, endTime]]

// init from pre-saved data
const initState = () => {
  const timerSetting = document
    .getElementById(timerSettingId)
    .addEventListener("change", timerSettingChange);
  if (contractionHistory.length > 0) {
    updateNode(
      startTimeId,
      new Date(contractionHistory[0][0]).toLocaleString()
    );
    isContracting =
      contractionHistory[contractionHistory.length - 1].length === 1;
    updateButtonNode();
    updateNode(numberOfId, contractionHistory.length);
    initAvgs();
    updateTimeSince(new Date().getTime());
    updateLengthNode();
    updateTimeBetweenNode();
  }
};
window.onload = initState;

// toggle display tabs
const displaySection = (section) => {
  if (section === energySectionId) {
    updateTimeSince(new Date().getTime());
  }
  sectionIds.forEach((id) => {
    if (section != id) {
      updateNodeClasslist(id, "hidden", true);
    } else {
      updateNodeClasslist(id, "hidden", false);
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
    startContraction(nowDate);
    updateNode(numberOfId, contractionHistory.length);
  } else {
    console.log("stopping");
    isContracting = false;
    endContraction(now);
  }
  updateButtonNode();
};

const timerSettingChange = (event) => {
  const val = parseInt(event.target.value);
  if (val == 0 && tickLength > 0) {
    updateNodeClasslist(timerSettingLabelId, "inactive", true);
    if (isContracting) {
      const startDateTime = new Date();
      startDateTime.setTime(contractionHistory[contractionHistory.length - 1]);
      updateNode(activeLengthId, startDateTime.toLocaleTimeString());
    }
  } else if (tickLength == 0 && val > 0) {
    updateTimeSince(new Date().getTime());
    updateNodeClasslist(timerSettingLabelId, "inactive", false);
  }

  if (val > 1 && tickLength <= 1) {
    updateNode("timer-settings-seconds", "\xa0Seconds");
  } else if (tickLength > 1 && val <= 1) {
    updateNode("timer-settings-seconds", "\xa0Second");
  }

  if (val == 0 && tickLength > 0) {
    updateNodeClasslist("no-timer-label", "hidden", false);
  } else {
    updateNodeClasslist("no-timer-label", "hidden", true);
  }

  tickLength = val;
  if (intervalId != -1) {
    window.clearInterval(intervalId);
    intervalId = window.setInterval(timerTick, tickLength * 1000);
  }
};

const timerTick = () => {
  updateTimeSince(new Date().getTime());
};

// add new contraction to contractionHistory
// Update time between average and node
// set active time string and start time if necessary
const startContraction = (nowDate) => {
  const numContractions = contractionHistory.push([nowDate.getTime()]);
  if (numContractions > 1) {
    updateTimeBetweenAvg();
    updateTimeBetweenNode();
  }
  const activeLengthStr =
    tickLength > 0 ? msToMinuteStr(0) : nowDate.toLocaleTimeString();
  updateNode(activeLengthId, activeLengthStr);
  intervalId = window.setInterval(timerTick, tickLength * 1000);
};

// push end time of contraction to contraction history
// update length average and node
// clear timer interval and active time node
const endContraction = (now) => {
  const numContractions = contractionHistory.length;
  contractionHistory[numContractions - 1].push(now);
  updateLengthAvg();
  updateLengthNode();
  updateNode(activeLengthId, "--:--");
  if (tickLength > 0) {
    window.clearInterval(intervalId);
    intervalId = -1;
  }
};

const toggleAvgInfo = () => {
  console.log("toggle avg called");
  isAvg = !isAvg;
  updateLengthNode();
  updateTimeBetweenNode();
};

const initAvgs = () => {
  // init tb
  const numContractions = contractionHistory.length;
  if (numContractions > 1) {
    const numVals = Math.min(numContractions - 1, avgWindow);
    const startI = Math.max(numContractions - avgWindow, 1);
    const avgSum = contractionHistory.slice(startI).reduce((sum, c, idx) => {
      return sum + c[0] - contractionHistory[startI + idx - 1][0];
    }, 0);
    avgTimeBetween = avgSum / numVals;
  }
  // init length
  const numFullContractions = getContractionCount();

  const numVals = Math.min(numFullContractions, avgWindow);
  const startI = Math.max(numFullContractions - avgWindow, 0);
  avgLength =
    contractionHistory.slice(startI, startI + numVals).reduce((sum, c) => {
      return sum + c[1] - c[0];
    }, 0) / numVals;
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

const calcLength = (c) => {
  return c[1] - c[0];
};

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

const updateNodeClasslist = (id, className, isAdd) => {
  if (isAdd) {
    document.getElementById(id).classList.add(className);
  } else {
    document.getElementById(id).classList.remove(className);
  }
};

const pauseSymbol = "\u{23F8}";
const playSymbol = "\u{25B6}";
const updateButtonNode = () => {
  if (contractionHistory.length == 1) {
    updateNode(contractButtonTextId, "Contraction");
  }
  updateNode(buttonSymbolId, isContracting ? pauseSymbol : playSymbol);
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
  if (isContracting && tickLength > 0) {
    updateNode(
      activeLengthId,
      msToMinuteStr(now - contractionHistory[contractionHistory.length - 1][0])
    );
  }
};
