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
let startTime;
let isAvg = false;
let avgLength = 5;
let lastFood = 0;
let lastDrink = 0;

const testHistory = [
  [1736021681164, 1736021703852],
  [1736021734451, 1736021760883],
  [1736021808591, 1736021829778],
  [1736022137140, 1736022230180],
  [1736022422456, 1736022473224],
];

const contractionHistory = testHistory; //[[startTime, endTime]]

// tab toggles
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
  if (startTime === undefined) {
    console.log("first time");
    startTime = now;
    updateNode(startTimeId, nowDate.toLocaleString());
  }

  updateTimeSince(now);

  // start contraction
  if (!isContracting) {
    console.log("starting");
    isContracting = true;
    startContraction(now);
    bumpContractionCount();
    updateNode(contractButtonId, "End Contraction");
  } else {
    console.log("stopping");
    isContracting = false;
    endContraction(now);
    updateNode(contractButtonId, "Start Contraction");
  }
};

const bumpContractionCount = () => {
  updateNode(numberOfId, contractionHistory.length);
};

// todo: need to account for isAvg
const startContraction = (now) => {
  const numContractions = contractionHistory.length;
  contractionHistory.push([now]);
  if (numContractions > 1) {
    const timeBetween = now - contractionHistory[numContractions - 2][0];
    updateNode(timeBetweenId, msToHourStr(timeBetween));
  }
};

const endContraction = (now) => {
  const numContractions = contractionHistory.length;
  contractionHistory[numContractions - 1].push(now);
  const length = now - contractionHistory[numContractions - 1][0];
  console.log(
    `new contraction: [${contractionHistory[numContractions - 1][0]},${
      contractionHistory[numContractions - 1][1]
    }], length - ${length}`
  );
  updateNode(lengthId, msToMinuteStr(isAvg ? getAvgLength() : length));
};

// todo: avg swap is buggy
// display averages or not
// avg length is way off
// avg time-between doesn't change
const toggleAvgInfo = () => {
  // calculate
  console.log("toggle avg called");
  const numContractions = numCompleteContractions();

  if (!isAvg) {
    isAvg = true;
    const startI =
      numContractions > avgLength ? numContractions - avgLength : 0;

    const numVals = Math.min(avgLength, numContractions);
    console.log(`taking ${numVals} starting at ${startI}`);
    let sumContractLn = 0;
    let sumTimeBetween = 0;
    contractionHistory
      .slice(startI, startI + numVals)
      .forEach((contraction, iter) => {
        const idx = startI + iter;
        sumContractLn += contraction[1] - contraction[0];
        console.log(
          `checking val ${idx}, new length ${
            contraction[1] - contraction[0]
          }, new sum ${sumContractLn}`
        );

        // todo: fix that we're getting numVals-1 for avg on contraction length
        if (idx > 0) {
          sumTimeBetween += contraction[0] - contractionHistory[idx - 1][0];
          console.log(
            `time between: ${
              contraction[0] - contractionHistory[idx - 1][0]
            }, sum ${sumTimeBetween}`
          );
        }
      });

    if (numContractions > 0) {
      updateNode(lengthId, msToMinuteStr(sumContractLn / numVals));
    }
    if (numContractions > 1) {
      updateNode(timeBetweenId, msToHourStr(sumTimeBetween / numVals));
    }
    return;
  }

  isAvg = false;

  // need at least one full contraction
  if (numContractions > 0) {
    updateNode(
      lengthId,
      msToMinuteStr(
        contractionHistory[numContractions - 1][1] -
          contractionHistory[numContractions - 1][0]
      )
    );
  }
  if (numContractions > 1) {
    updateNode(
      timeBetweenId,
      msToHourStr(
        contractionHistory[numContractions - 1][0] -
          contractionHistory[numContractions - 2][0]
      )
    );
  }
};

const getAvgLength = () => {
  const numContractions = numCompleteContractions();
  if (numContractions > 0) {
    const startI =
      numContractions > avgLength ? numContractions - avgLength : 0;

    const numVals = Math.min(avgLength, numContractions);
    console.log(`taking ${numVals} starting at ${startI}`);
    let sumContractLn = 0;
    contractionHistory
      .slice(startI, startI + numVals)
      .forEach((contraction, iter) => {
        const idx = startI + iter;
        sumContractLn += contraction[1] - contraction[0];
        console.log(
          `checking val ${idx}, new length ${
            contraction[1] - contraction[0]
          }, new sum ${sumContractLn}`
        );
      });
    return sumContractLn / numVals;
  }
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

// now: number
const updateTimeSince = (now) => {
  if (lastFood > 0) {
    updateNode(sinceLastFoodId, msToHourStr(now - lastFood) + " ago");
  }
  if (lastDrink > 0) {
    updateNode(sinceLastDrinkId, msToMinuteStr(now - lastDrink) + " ago");
  }
};

// utility methods

const numCompleteContractions = () => {
  const numContractions = contractionHistory.length;

  // there are either no contractions or the first one is still incomplete
  if (
    numContractions == 0 ||
    (numContractions == 1 && contractionHistory[0].length == 1)
  ) {
    return -1;
  }

  return contractionHistory[numContractions - 1].length > 1
    ? numContractions
    : numContractions - 1;
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
