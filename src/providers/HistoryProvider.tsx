import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import ContractionProvider from "./ContractionProvider";

export type HistoryType = "Drink" | "Food" | "Toilet" | "C_Start" | "C_Stop";

interface HistoryItem {
  id: number;
  label: HistoryType;
  time: number;
  contraction: number;
  note: string;
}

interface ContractionItem {
  startId: number;
  startTime: number;
  endId: number;
  endTime: number;
}

const EMPTY_CONTRACTION: ContractionItem = {
  startId: 0,
  startTime: -2,
  endId: -10,
  endTime: -1,
};

interface ReminderItem {
  id: number;
  time: number;
  contraction: number;
}

export const EMPTY_REMINDER: ReminderItem = {
  id: -1,
  time: 0,
  contraction: 0,
};

interface ValueOut {
  addHistoryItem: (
    label: HistoryType,
    time: number,
    contraction?: number
  ) => void;
  lastDrink: ReminderItem;
  lastFood: ReminderItem;
  lastToilet: ReminderItem;
  lastContraction: ContractionItem;
  newContraction: ContractionItem;
  numContractions: number;
  startTime: string;
}
const INIT_VALUE: ValueOut = {
  addHistoryItem: () => {
    console.log("Empty History add method");
    return 0;
  },
  lastDrink: EMPTY_REMINDER,
  lastFood: EMPTY_REMINDER,
  lastToilet: EMPTY_REMINDER,
  lastContraction: EMPTY_CONTRACTION,
  newContraction: EMPTY_CONTRACTION,
  numContractions: 0,
  startTime: "",
};

export const HistoryContext = createContext<ValueOut>(INIT_VALUE);
const HistoryProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const HIST_KEY = "history_key";
  const TIME_KEY = "time_key";
  const [history, setHistory] = useState<Array<HistoryItem>>(() => {
    const savedHistory = window.localStorage.getItem(HIST_KEY);
    return savedHistory != null ? JSON.parse(savedHistory) : [];
  });

  // list of relevant ids
  const [drinkLog, setDrinkLog] = useState<Array<number>>([]);
  const [lastDrink, setLastDrink] = useState<ReminderItem>(EMPTY_REMINDER);

  const [foodLog, setFoodLog] = useState<Array<number>>([]);
  const [lastFood, setLastFood] = useState<ReminderItem>(EMPTY_REMINDER);

  const [toiletLog, setToiletLog] = useState<Array<number>>([]);
  const [lastToilet, setLastToilet] = useState<ReminderItem>(EMPTY_REMINDER);

  const [contractionLog, setContractionLog] = useState<Array<[number, number]>>(
    []
  );
  const [newContraction, setNewContraction] =
    useState<ContractionItem>(EMPTY_CONTRACTION);
  const [lastContraction, setLastContraction] =
    useState<ContractionItem>(EMPTY_CONTRACTION);

  // init from saved history
  useEffect(() => {
    if (history.length > 0) {
      setDrinkLog(history.filter((h) => h.label === "Drink").map((h) => h.id));
      setFoodLog(history.filter((h) => h.label === "Food").map((h) => h.id));
      setToiletLog(
        history.filter((h) => h.label === "Toilet").map((h) => h.id)
      );

      let idList: Array<[number, number]> = [];
      let lastContraction = EMPTY_CONTRACTION;
      let newContraction = EMPTY_CONTRACTION;
      history
        .filter((h) => h.label.includes("C_"))
        .forEach((c) => {
          if (c.label === "C_Start") {
            newContraction = {
              ...newContraction,
              startId: c.id,
              startTime: c.time,
            };
          } else {
            lastContraction = {
              ...newContraction,
              endId: c.id,
              endTime: c.time,
            };
            idList.push([lastContraction.startId, lastContraction.endId]);
            newContraction = EMPTY_CONTRACTION;
          }
        });
      setLastContraction(lastContraction);

      // we were in the middle of a contraction last time
      if (newContraction != EMPTY_CONTRACTION) {
        idList.push([newContraction.startId, -1]);
        setNewContraction(newContraction);
      }
      setContractionLog(idList);
    }
  }, []);

  // save history to local storage
  useEffect(() => {
    window.localStorage.setItem(HIST_KEY, JSON.stringify(history));
  }, [history]);

  // need to check this still works
  const addHistoryItem = useCallback(
    (label: HistoryType, time: number) => {
      const id = Math.random();
      const newHistoryItem: HistoryItem = {
        id,
        label,
        time,
        contraction: contractionLog.length,
        note: "",
      };
      setHistory((h) => [...h, newHistoryItem]);

      // update type specific log
      let newLogItem;
      if (label in ["Drink", "Food", "Toilet"]) {
        newLogItem = {
          id,
          time,
          contraction: contractionLog.length,
        } as ReminderItem;
      } else if (label === "C_Start") {
        newLogItem = {
          startId: id,
          startTime: time,
          endTime: -1,
        } as ContractionItem;
      } else {
        // C_Stop
        newLogItem = {
          ...newContraction,
          endId: id,
          endTime: time,
        } as ContractionItem;
      }

      switch (label) {
        case "Drink":
          setDrinkLog((l) => [...l, id]);
          setLastDrink(newLogItem as ReminderItem);
          break;

        case "Food":
          setFoodLog((l) => [...l, id]);
          setLastFood(newLogItem as ReminderItem);
          break;

        case "Toilet":
          setToiletLog((l) => [...l, id]);
          setLastToilet(newLogItem as ReminderItem);
          break;

        case "C_Start":
          // ToDo: This v--v
          // setContractionLog((l) => [...l, [id]]);
          setNewContraction(newLogItem as ContractionItem);
          break;

        case "C_Stop":
          setLastContraction(newLogItem as ContractionItem);
          setNewContraction(EMPTY_CONTRACTION);
          break;

        default:
          console.error("received - " + label + " - does not exist");
      }
    },
    [newContraction]
  );

  const value: ValueOut = useMemo(() => {
    return {
      addHistoryItem,
      lastDrink,
      lastFood,
      lastToilet,
      lastContraction,
      newContraction,
      numContractions: contractionLog.length,
      startTime: "",
    };
  }, [
    addHistoryItem,
    lastDrink,
    lastFood,
    lastToilet,
    lastContraction,
    newContraction,
    contractionLog,
    /* start time */
  ]);

  return (
    <HistoryContext.Provider value={value}>
      <ContractionProvider>{children}</ContractionProvider>
    </HistoryContext.Provider>
  );
};

export default HistoryProvider;
