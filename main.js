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
const settingsSectionId = "settings-wrapper";
const sectionIds = [laborSectionId, energySectionId, settingsSectionId];

// state
// db state
let dbVersion = 0;

// General Energy and Settings, one point data
const SettingsStore = "SettingsStore";
const EnergyStore = "EnergyStore";
const ContractionStore = "ContractionStore";

// settings store
const dbSettingDefaults = [
  { key: "isAvg", value: false },
  { key: "tickLength", value: 1 },
];

const dbEnergyDefaults = [
  { key: "lastFood", value: 0 },
  { key: "lastDrink", value: 0 },
];

// IDBDatabase
let db;

// timer state
let intervalId = -1;
let tickLength = 1;

// contraction state
let isContracting = false;
let avgLength = 0;
let avgTimeBetween = 0;

// avg
let isAvg = false;
// num values to use for average
let avgWindow = 5;

// energy state
let lastFood = 0;
let lastDrink = 0;

let contractionHistory = []; //[[startTime, endTime]]

// db methods //
// open success
const dbOpenSuccess = (event) => {
  if (!event.type == "success") {
    console.error("success handler, but event type is not success", event);
    return;
  }

  console.log("successfully opened db");
  db = event.target.result;
  initState(db);
  db.onerror = dbOnError;
};

// open error
const dbOpenError = (event) => {
  // most likely b/c they didn't give permission
  // pop up explanation alert if so
  console.error("There was an error opening the database", event);

  // could also be VER_ERR, verion stored on disk is greater than version in method
};

// generic error handler
const dbOnError = (event) => {
  console.error(`Database error: ${event.target.error?.message}`);
};

const dbOnUpgrade = (event) => {
  // Save the IDBDatabase interface
  db = event.target.result;

  // ObjectStore for array of contraction times
  const createDbTx = db.createObjectStore(ContractionStore, {
    autoIncrement: true,
  });

  db.createObjectStore(SettingsStore, {
    keyPath: "key",
  });

  // init energy store
  db.createObjectStore(EnergyStore, {
    keyPath: "key",
  });

  createDbTx.transaction.oncomplete = (event) => {
    console.log("db and object stores created, init data");
    initSettingsStore();
    initEnergyStore();
  };
};

const initDbStores = () => {
  // init settings store
  initSettingsStore();
  initEnergyStore();
  const clearTransaction = db
    .transaction(ContractionStore, "readwrite")
    .objectStore(ContractionStore)
    .clear();

  clearTransaction.onsuccess = () => {
    console.log("contraction store cleared!");
  };
};

const initSettingsStore = () => {
  console.log("initing Settings store");
  const settingObjectStore = db
    .transaction(SettingsStore, "readwrite")
    .objectStore(SettingsStore);

  dbSettingDefaults.forEach((setting) => {
    settingObjectStore.add(setting);
  });
  console.log("setting object store initialized!");
};

const initEnergyStore = () => {
  console.log("initing Energy store");
  const energyObjectStore = db
    .transaction(EnergyStore, "readwrite")
    .objectStore(EnergyStore);

  dbEnergyDefaults.forEach((energy) => {
    energyObjectStore.add(energy);
  });
  console.log("energy object store initialized!");
};

const updateDb = (key, value) => {
  let tx;
  switch (key) {
    case "lastFood":
    case "lastDrink": {
      // update db
      tx = db
        .transaction(EnergyStore, "readwrite")
        .objectStore(EnergyStore)
        .put({ key: key, value: value });

      break;
    }

    case "isAvg":
    case "tickLength": {
      tx = db
        .transaction(SettingsStore, "readwrite")
        .objectStore(SettingsStore)
        .put({ key: key, value: value });
      break;
    }

    case "contraction": {
      tx = db
        .transaction(ContractionStore, "readwrite")
        .objectStore(ContractionStore)
        .add(value);
      break;
    }

    default: {
      console.error("tried updating unknown db field");
      return;
    }
  }
  if (tx) {
    tx.onsuccess = () => {
      console.log(`${key} updated to  ${value}`);
    };
  }
};

//open db
const dbOpenRequest = window.indexedDB.open("ContractionTimerDatabase", 1);

// add event handlers
dbOpenRequest.onsuccess = dbOpenSuccess;
dbOpenRequest.onerror = dbOpenError;
dbOpenRequest.onupgradeneeded = dbOnUpgrade;

// init from pre-saved data
const initState = (db) => {
  // timer input change listener
  document
    .getElementById(timerSettingId)
    .addEventListener("change", timerSettingChange);

  const tx = db.transaction([ContractionStore, SettingsStore, EnergyStore]);

  // energy store
  const energyStore = tx.objectStore(EnergyStore);
  energyStore.get("lastFood").onsuccess = (event) => {
    console.log(`last food: ${event.target.result.value}`);
    lastFood = event.target.result.value;
    updateNode(lastFoodId, new Date(lastFood).toLocaleTimeString());
  };

  energyStore.get("lastDrink").onsuccess = (event) => {
    console.log(`last drink: ${event.target.result.value}`);
    lastDrink = event.target.result.value;
    updateNode(lastDrinkId, new Date(lastDrink).toLocaleTimeString());
  };

  // settings store
  const settingsStore = tx.objectStore(SettingsStore);
  settingsStore.get("isAvg").onsuccess = (event) => {
    console.log(`isAvg: ${event.target.result.value}`);
    isAvg = event.target.result.value;
    if (isAvg) {
      document.getElementById("average-checkbox").checked = true;
    }
  };

  settingsStore.get("tickLength").onsuccess = (event) => {
    console.log(`tickLength: ${event.target.result.value}`);
    tickLength = event.target.result.value;
  };

  // contractions
  const contractionStore = tx.objectStore(ContractionStore);
  contractionStore.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      if (cursor.key % 2 === 1) {
        contractionHistory.push([cursor.value]);
        console.log(
          `${cursor.key}: new contraction - start-time: is ${cursor.value}`
        );
      } else {
        contractionHistory[contractionHistory.length - 1].push(cursor.value);
        console.log(`${cursor.key}: end-time: is ${cursor.value}`);
      }
      cursor.continue();
    } else {
      console.log("Done adding contractions!");
    }
  };

  tx.oncomplete = (event) => {
    console.log("db transactions complete, compute derived state");
    // if there is saved state
    if (contractionHistory.length > 0) {
      // add labor start time
      updateNode(
        startTimeId,
        new Date(contractionHistory[0][0]).toLocaleString()
      );

      // isContracting boolean,
      // based off if previous contraction is unfinished
      isContracting =
        contractionHistory[contractionHistory.length - 1].length === 1;

      if (isContracting && tickLength > 0) {
        console.log("starting timer, saved data has incomplete contraction");
        startTimer();
      }

      // update button text based off if we're contracting
      updateButtonNode();

      // contraction count
      updateNode(numberOfId, contractionHistory.length);

      // calculate average values of current data
      initAvgs();

      // latest or avg contraction length
      updateLengthNode();

      // latest or avg time between
      updateTimeBetweenNode();
    } else {
      console.log("no contraction history to derive from");
    }
    // if there's food or drink history, update time
    updateTimeSince(new Date().getTime());
  };
};

// timer methods //

// update timer length
// restart timer if necessary
// adjust settings display
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

  updateDb("tickLength", tickLength);
};

// runs every tickLength seconds
const timerTick = () => {
  updateTimeSince(new Date().getTime());
};

const startTimer = () => {
  intervalId = window.setInterval(timerTick, tickLength * 1000);
};

// contraction methods //

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
  updateDb("contraction", now);
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
  startTimer();
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

// Average Methods //

// called when restoring saved history
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

// latest or avg info display
const toggleAvgInfo = () => {
  console.log("toggle avg called");
  isAvg = !isAvg;
  updateLengthNode();
  updateTimeBetweenNode();

  updateDb("isAvg", isAvg);
};

// called in contraction methods
// when new values available
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

// energy iterate methods
const addFood = () => {
  const now = new Date();
  lastFood = now.getTime();
  updateNode(lastFoodId, now.toLocaleTimeString());
  updateTimeSince(now);
  updateDb("lastFood", lastFood);
};

const addDrink = () => {
  const now = new Date();
  lastDrink = now.getTime();
  updateNode(lastDrinkId, now.toLocaleTimeString());
  updateTimeSince(now);
  updateDb("lastDrink", lastDrink);
};

// utility methods //

// history convenience
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

// arr: number[]
const simpleAvg = (arr) => {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
};

// print convenience
// ms: number
const msToMinuteStr = (ms) => {
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
      ? `${printInt(hr)}:${printInt(min % 60)}:${printInt(sec % 60)}`
      : `${printInt(min)}:${printInt(sec % 60)}`;

  return out;
};

// n | 0
// quick floor function, I know that my numbers will function as 32bit, positive integers
const printInt = (n) => {
  return padNumber(n | 0);
};

const padNumber = (n) => {
  return n >= 10 ? "" + n : "0" + n;
};

// html node update methods
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
  if (contractionHistory.length > 0) {
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
