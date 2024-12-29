// element ids
const startTimeId = "start-time";
const numberOfId = "num-contractions";
const lastLengthId = "last-contract-length";
const timeBetweenId = "time-between";
const currentLengthId = "current-contract-length";
const contractButtonId = "contract-button";

// state
let startTime;
let numContractions = 0;
let isContracting = false;
let currentStart;
let lastLength;
let timeBetween;

// main toggle method
const toggleContraction = () => {
  // first contraction
  if (startTime === undefined) {
    console.log("first time");
    const now = new Date();
    startTime = now.getTime();
    updateNode(startTimeId, now.toLocaleString());
  }

  // start contraction
  if (!isContracting) {
    console.log("starting");
    isContracting = true;
    startContraction();
    bumpContractionCount();
    updateNode(contractButtonId, "End Contraction");
  } else {
    console.log("stopping");
    isContracting = false;
    endContraction();
    updateNode(contractButtonId, "Start Contraction");
  }
};

const bumpContractionCount = () => {
  numContractions += 1;
  updateNode(numberOfId, numContractions);
};

const startContraction = () => {
  const now = new Date();
  if (currentStart !== undefined) {
    timeBetween = now.getTime() - currentStart;
    updateNode(timeBetweenId, msToHourStr(timeBetween));
  }
  currentStart = now.getTime();
};

const endContraction = () => {
  const now = new Date();
  lastLength = now.getTime() - currentStart;
  updateNode(lastLengthId, msToMinuteStr(lastLength));
};

const msToMinuteStr = (ms) => {
  console.log(ms);
  const sec = ms / 1000;
  const min = sec / 60;

  return `${printInt(min)}:${printInt(sec % 60)}`;
};

const msToHourStr = (ms) => {
  const sec = ms / 1000;
  const min = sec / 60;
  const hr = min / 60;
  const out =
    hr >= 1
      ? `${printInt(hr)}:${printInt(min)}:${printInt(sec % 60)}`
      : `${printInt(min)}:${printInt(sec % 60)}`;

  return out;
};

const printInt = (n) => {
  return padNumber(n | 0);
};

const padNumber = (n) => {
  return ("0" + n).slice(-2);
};

const updateNode = (id, newText) => {
  document.getElementById(id).textContent = newText;
};
