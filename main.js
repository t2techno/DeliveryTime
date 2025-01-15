// HTML element ids

// labor state
const startTimeId = "start-time";
const countId = "contraction-count";
const lengthId = "contraction-length";
const timeBetweenId = "contraction-time-between";
const activeLengthId = "active-contraction-length";

// energy state
const lastDrinkId = "last-drink";
const sinceLastDrinkId = "since-last-drink";
const lastFoodId = "last-food";
const sinceLastFoodId = "since-last-food";

// settings state
const tickLengthLabelId = "tick-length-label";
const tickLengthId = "tick-length-input";
const tickLengthSecondsId = "tick-length-seconds-text";
const noTickLabelId = "no-tick-label";

// inputs
const displayAvgCheckboxId = "labor-display-avg-checkbox";
const displayAvgWrapperId = "labor-display-avg-wrapper";
const tabLaborInputId = "tab-labor-input";

// button
const contractButtonTextId = "contract-button-text";
const buttonSymbolId = "contract-button-symbol";

// display sections
const laborContentId = "tab-labor-content";
const energyContentId = "tab-energy-content";
const settingsContentId = "tab-settings-content";
const sectionIds = [laborContentId, energyContentId, settingsContentId];

// state
// db state
let dbVersion = 0;

const SettingsStore = "SettingsStore";
const EnergyStore = "EnergyStore";
const ContractionStore = "ContractionStore";

// timer state
let intervalId = -1;
let tickLength = 1;

// contraction state
let isContracting = false;
let avgLength = 0;
let avgTimeBetween = 0;

// display avg flag
let isAvg = false;

// display average of last <avgWindow> values
const avgWindow = 5;

// energy state
let lastFood = 0;
let lastDrink = 0;

// [[startTime, endTime]]
let contractionHistory = [];

// define db methods and open database//
// settings store
const dbSettingsDefaults = [
  { key: "isAvg", value: false },
  { key: "tickLength", value: 1 },
];

const dbEnergyDefaults = [
  { key: "lastFood", value: 0 },
  { key: "lastDrink", value: 0 },
];

// IDBDatabase
let db;

// open success
// inits timer state with db result
const dbOpenSuccess = (event) => {
  if (!event.type == "success") {
    console.error("success handler, but event type is not success", event);
    return;
  }

  console.log("successfully opened db");
  db = event.target.result;
  initApp(db);
  db.onerror = dbOnError;
};

// open error
// todo, handle this
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

// initialize db from scratch
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

// deletes history/energy values resets settings
const resetDbStores = (isReset) => {
  // init settings store
  initSettingsStore(isReset);
  initEnergyStore(isReset);
  const clearTransaction = db
    .transaction(ContractionStore, "readwrite")
    .objectStore(ContractionStore)
    .clear();

  clearTransaction.onsuccess = () => {
    console.log("contraction store cleared!");
  };
};

// called in dbOnUpgrade and resetDbStores
// isReset makes the operation a put
const initSettingsStore = (isReset) => {
  console.log("initing Settings store");
  const settingObjectStore = db
    .transaction(SettingsStore, "readwrite")
    .objectStore(SettingsStore);

  dbSettingsDefaults.forEach((setting) => {
    if (isReset) {
      settingObjectStore.put(setting);
    } else {
      settingObjectStore.add(setting);
    }
  });
  console.log("setting object store initialized!");
};

// called in dbOnUpgrade and resetDbStores
// isReset makes the operation a put
const initEnergyStore = (isReset) => {
  console.log("initing Energy store");
  const energyObjectStore = db
    .transaction(EnergyStore, "readwrite")
    .objectStore(EnergyStore);

  dbEnergyDefaults.forEach((energy) => {
    if (isReset) {
      energyObjectStore.put(energy);
    } else {
      energyObjectStore.add(energy);
    }
  });
  console.log("energy object store initialized!");
};

// update value in database
// possible keys:
// lastFood, lastDrink - EnergyStore
// isAvg, tickLength   - SettingsStore
// contraction         - ContractionStore
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
        .objectStore(ContractionStore);

      const latestVal = getHistoryLast();
      if (latestVal.length == 1) {
        // new contraction
        tx.add(latestVal);
      } else {
        // update latest contraction in store
        tx.openCursor(null, "prev").onsuccess = (event) => {
          event.target.result.update(latestVal);
        };
      }
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

// load data from database
const initApp = (db) => {
  // tick length input change listener
  document
    .getElementById(tickLengthId)
    .addEventListener("change", tickLengthChange);

  // database transaction spanning all stores
  const tx = db.transaction([ContractionStore, SettingsStore, EnergyStore]);

  // load energy store - lastFood and lastDrink
  const energyStore = tx.objectStore(EnergyStore);
  energyStore.get("lastFood").onsuccess = (event) => {
    console.log(`last food: ${event.target.result.value}`);
    lastFood = event.target.result.value;
    if (lastFood > 0) {
      updateNode(lastFoodId, new Date(lastFood).toLocaleTimeString());
    }
  };

  energyStore.get("lastDrink").onsuccess = (event) => {
    console.log(`last drink: ${event.target.result.value}`);
    lastDrink = event.target.result.value;
    if (lastDrink > 0) {
      updateNode(lastDrinkId, new Date(lastDrink).toLocaleTimeString());
    }
  };

  // load settings store - isAvg and tickLength
  const settingsStore = tx.objectStore(SettingsStore);
  settingsStore.get("isAvg").onsuccess = (event) => {
    console.log(`isAvg: ${event.target.result.value}`);
    isAvg = event.target.result.value;
    document.getElementById(displayAvgCheckboxId).checked = isAvg;
  };

  settingsStore.get("tickLength").onsuccess = (event) => {
    console.log(`tickLength: ${event.target.result.value}`);
    document.getElementById(tickLengthId).value = event.target.result.value;
    tickLengthChange({ target: { value: event.target.result.value } });
  };

  // load contraction store for contraction history
  const contractionStore = tx.objectStore(ContractionStore);
  contractionStore.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;
    // odd index is start time, even values are end times
    // ToDo - I can't rely on auto-increment index, need to redo this with arrays
    if (cursor) {
      contractionHistory.push(cursor.value);
      cursor.continue();
    } else {
      console.log("Done adding contractions!");
    }
  };

  // tx complete means all db data is done loading, can now compute derived state
  // labor start time, isContracting, average length/time-between
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
      // based off if latest contraction is unfinished
      isContracting = getHistoryLast().length === 1;

      if (isContracting && tickLength > 0) {
        console.log("starting timer, saved data has incomplete contraction");
        startTimer();
      }

      // update button text based off if we're contracting
      updateButtonNode();

      // contraction count
      updateNode(countId, contractionHistory.length);

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
    updateTimeSinceNodes(new Date());
  };
};

// resets db, text nodes, and state to default values
const resetApp = () => {
  // reset state variables
  intervalId = -1;

  // contraction state
  isContracting = false;
  avgLength = 0;
  avgTimeBetween = 0;

  // avg display
  isAvg = false;

  // energy state
  lastFood = 0;
  lastDrink = 0;

  contractionHistory = [];

  // reset database
  resetDbStores(true);

  // reset text nodes
  // labor content
  updateNodeClasslist(displayAvgWrapperId, "inactive", !isAvg);
  document.getElementById(displayAvgCheckboxId).checked = false;
  updateNode(startTimeId, "--:--");
  updateLengthNode();
  updateTimeBetweenNode();
  updateNode(countId, 0);

  // Energy Content
  updateTimeSinceNodes(new Date());
  updateNode(lastFoodId, "--:--");
  updateNode(lastDrinkId, "--:--");

  // Settings Content
  document.getElementById(tickLengthId).value = 1;
  // mimic expected event object structure to set my own value
  tickLengthChange({ target: { value: 1 } });

  updateButtonNode();

  // select and open labor tab
  document.getElementById(tabLaborInputId).checked = true;
  displaySection(laborContentId);
};

// This runs immediately upon page load //
//open db
const dbOpenRequest = window.indexedDB.open("ContractionTimerDatabase", 1);

// add event handlers
dbOpenRequest.onsuccess = dbOpenSuccess;
dbOpenRequest.onerror = dbOpenError;
dbOpenRequest.onupgradeneeded = dbOnUpgrade;

// End page load code //

// timer methods //

// update tick length
// restart timer if necessary
// adjust settings display
const tickLengthChange = (event) => {
  const val = parseInt(event.target.value);
  const nowDate = new Date();
  if (val == 0 && tickLength > 0) {
    updateNodeClasslist(tickLengthLabelId, "inactive", true);
    if (isContracting) {
      const startDateTime = nowDate;
      startDateTime.setTime(getHistoryLast());
      updateNode(activeLengthId, startDateTime.toLocaleTimeString());
    }
  } else if (tickLength == 0 && val > 0) {
    updateTimeSinceNodes(nowDate);
    updateNodeClasslist(tickLengthLabelId, "inactive", false);
  }
  if (val !== 1 && tickLength == 1) {
    updateNode(tickLengthSecondsId, "\xa0Seconds");
  } else if (val === 1 && tickLength != 1) {
    updateNode(tickLengthSecondsId, "\xa0Second");
  }

  if (val == 0 && tickLength > 0) {
    updateNodeClasslist(noTickLabelId, "hidden", false);
  } else {
    updateNodeClasslist(noTickLabelId, "hidden", true);
  }
  tickLength = val;
  startTimer();

  updateDb("tickLength", tickLength);
};

// runs every tickLength seconds
const timerTick = () => {
  updateTimeSinceNodes(new Date());
};

const startTimer = () => {
  if (intervalId != -1) {
    console.log("cancelling old timer");
    window.clearInterval(intervalId);
    intervalId = -1;
  }
  if (tickLength > 0) {
    console.log("starting timer with ticklength " + tickLength);
    intervalId = window.setInterval(timerTick, tickLength * 1000);
  }
};

// Contraction methods //

// main toggle method
const toggleContraction = () => {
  const nowDate = new Date();
  const now = nowDate.getTime();
  // first contraction
  if (contractionHistory.length == 0) {
    console.log("first time");
    updateNode(startTimeId, nowDate.toLocaleString());
  }

  updateTimeSinceNodes(nowDate);

  // start contraction
  if (!isContracting) {
    console.log("starting");
    isContracting = true;
    startContraction(nowDate);
    updateNode(countId, contractionHistory.length);
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
    tickLength > 0 ? msToTimeStr(0) : nowDate.toLocaleTimeString();
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
// Keeps the average of the last <avgWindow> values

// called when restoring saved history
const initAvgs = () => {
  // init time-between
  // need at least 2 start times
  const numContractions = contractionHistory.length;
  if (numContractions > 1) {
    const numVals = Math.min(numContractions - 1, avgWindow);
    const startI = Math.max(numContractions - avgWindow, 1);
    const avgSum = contractionHistory
      .slice(startI)
      .reduce(
        (sum, c, idx) => sum + c[0] - contractionHistory[startI + idx - 1][0],
        0
      );
    avgTimeBetween = avgSum / numVals;
  }
  // init length
  const numFullContractions = getContractionCount();

  const numVals = Math.min(numFullContractions, avgWindow);
  const startI = Math.max(numFullContractions - avgWindow, 0);
  avgLength =
    contractionHistory
      .slice(startI, startI + numVals)
      .reduce((sum, c) => sum + c[1] - c[0], 0) / numVals;
};

// latest or avg info display
const toggleAvgInfo = () => {
  console.log("toggle avg called");
  isAvg = !isAvg;
  updateLengthNode();
  updateTimeBetweenNode();
  updateNodeClasslist(displayAvgWrapperId, "inactive", !isAvg);

  updateDb("isAvg", isAvg);
};

// called on contraction start
const updateTimeBetweenAvg = (tb) => {
  const numContractions = contractionHistory.length;
  // one less time-between than number of contractions
  if (numContractions - 1 <= avgWindow) {
    avgTimeBetween =
      contractionHistory
        .slice(1)
        .reduce((sum, c, idx) => sum + c[0] - contractionHistory[idx][0], 0) /
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

// called on contraction end
const updateLengthAvg = () => {
  const numContractions = contractionHistory.length;
  // we just do a normal avg until we have more than our window's length
  if (numContractions <= avgWindow) {
    avgLength =
      contractionHistory.reduce((sum, c) => sum + c[1] - c[0], 0) /
      numContractions;
    console.log("new avg: " + avgLength);
    return;
  }

  const newL = calcLength(contractionHistory[numContractions - 1]);
  const oldL = calcLength(contractionHistory[numContractions - avgWindow - 1]);
  avgLength += (newL - oldL) / avgWindow;
};

// energy iterate methods
const addFood = () => {
  const nowDate = new Date();
  lastFood = nowDate.getTime();
  updateNode(lastFoodId, nowDate.toLocaleTimeString());
  updateTimeSinceNodes(nowDate);
  updateDb("lastFood", lastFood);
};

const addDrink = () => {
  const nowDate = new Date();
  lastDrink = nowDate.getTime();
  updateNode(lastDrinkId, nowDate.toLocaleTimeString());
  updateTimeSinceNodes(nowDate);
  updateDb("lastDrink", lastDrink);
};

// utility methods //

// number of full contractions
const getContractionCount = () => {
  const numContractions = contractionHistory.length;
  if (numContractions == 0) {
    return 0;
  }

  return contractionHistory[numContractions - 1].length > 1
    ? numContractions
    : numContractions - 1;
};

// index of last full contraction
const getLatestIdx = () => {
  return getContractionCount() - 1;
};

// returns the last contraction in history
const getHistoryLast = () => contractionHistory[contractionHistory.length - 1];

const calcLength = (c) => {
  return c[1] - c[0];
};

// print convenience
// ms: number
const msToTimeStr = (ms) => {
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

// add or remove class to element by id
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
  if (!contractionHistory.length) {
    updateNode(contractButtonTextId, "Begin Labor");
    updateNode(buttonSymbolId, "");
  } else {
    updateNode(contractButtonTextId, "Contraction");
    updateNode(buttonSymbolId, isContracting ? pauseSymbol : playSymbol);
  }
};

const updateLengthNode = () => {
  // no lengths to display
  let newString;
  if (!contractionHistory.length || contractionHistory[0].length === 1) {
    newString = "--:--";
  } else {
    newString = isAvg
      ? msToTimeStr(avgLength)
      : msToTimeStr(calcLength(contractionHistory[getLatestIdx()]));
  }

  updateNode(lengthId, newString);
};

const updateTimeBetweenNode = () => {
  let newString = "";
  if (contractionHistory.length < 2) {
    newString = "--:--";
  } else {
    if (isAvg) {
      newString = msToTimeStr(avgTimeBetween);
    } else {
      const timeBetween =
        getHistoryLast()[0] -
        contractionHistory[contractionHistory.length - 2][0];

      newString = msToTimeStr(timeBetween);
    }
  }
  updateNode(timeBetweenId, newString);
};

const updateTimeSinceNodes = (nowDate) => {
  const now = nowDate.getTime();
  let newString = "";
  newString = lastFood > 0 ? msToTimeStr(now - lastFood) + " ago" : "--:--";
  updateNode(sinceLastFoodId, newString);

  newString = lastDrink > 0 ? msToTimeStr(now - lastDrink) + " ago" : "--:--";
  updateNode(sinceLastDrinkId, newString);

  if (isContracting) {
    newString =
      tickLength > 0
        ? msToTimeStr(now - getHistoryLast()[0])
        : nowDate.toLocaleTimeString();
  } else {
    newString = "--:--";
  }
  updateNode(activeLengthId, newString);
};

// toggle display tabs
const displaySection = (section) => {
  if (section === energyContentId) {
    updateTimeSinceNodes(new Date());
  }
  sectionIds.forEach((id) => {
    if (section != id) {
      updateNodeClasslist(id, "hidden", true);
    } else {
      updateNodeClasslist(id, "hidden", false);
    }
  });
};
