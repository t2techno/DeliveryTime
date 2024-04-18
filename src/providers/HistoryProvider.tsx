import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import ContractionProvider from "./ContractionProvider";

export type HistoryType = "Drink" | "Food" | "Toilet" | "Contraction";
export type DispatchType = "Drink" | "Food" | "Toilet" | "C_Start" | "C_Stop";

interface HistoryItem {
  id: number;
  label: HistoryType;
  startTime: number;
  endTime: number;
  contraction: number;
  note: string;
}

interface ContractionItem {
  id: number;
  startTime: number;
  endTime: number;
}

const EMPTY_CONTRACTION: ContractionItem = {
  id: 0,
  startTime: -2,
  endTime: -1,
};

interface ReminderItem {
  id: number;
  startTime: number;
  contraction: number;
}

export const EMPTY_REMINDER: ReminderItem = {
  id: -1,
  startTime: 0,
  contraction: 0,
};

interface ValueOut {
  addHistoryItem: (
    label: DispatchType,
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

  const [foodLog, setFoodLog] = useState<Array<number>>([]);

  const [toiletLog, setToiletLog] = useState<Array<number>>([]);

  const [contractionLog, setContractionLog] = useState<Array<number>>([]);

  // init from saved history
  useEffect(() => {
    if (history.length > 0) {
      setDrinkLog(history.filter((h) => h.label === "Drink").map((h) => h.id));
      setFoodLog(history.filter((h) => h.label === "Food").map((h) => h.id));
      setToiletLog(
        history.filter((h) => h.label === "Toilet").map((h) => h.id)
      );

      const contractions = history.filter((h) => h.label === "Contraction");
      if (contractions.length == 0) {
        return;
      }
      setContractionLog(contractions.map((c) => c.id));
    }
  }, []);

  // save history to local storage
  useEffect(() => {
    window.localStorage.setItem(HIST_KEY, JSON.stringify(history));
  }, [history]);

  // need to check this still works
  const addHistoryItem = useCallback(
    (type: DispatchType, time: number) => {
      const id = Math.random();

      // update type specific log
      let newHistoryItem: HistoryItem;
      if (type in ["Drink", "Food", "Toilet"]) {
        newHistoryItem = {
          id,
          label: type as HistoryType,
          startTime: time,
          endTime: time,
          contraction: contractionLog.length,
          note: "",
        };
      } else if (type === "C_Start") {
        newHistoryItem = {
          id,
          label: "Contraction",
          startTime: time,
          endTime: -1,
          contraction: contractionLog.length + 1,
          note: "",
        };
      }

      switch (type) {
        case "Drink":
          setDrinkLog((l) => [...l, id]);
          setHistory((h) => [...h, newHistoryItem]);
          break;

        case "Food":
          setFoodLog((l) => [...l, id]);
          setHistory((h) => [...h, newHistoryItem]);
          break;

        case "Toilet":
          setToiletLog((l) => [...l, id]);
          setHistory((h) => [...h, newHistoryItem]);
          break;

        case "C_Start":
          setHistory((h) => [...h, newHistoryItem]);
          setContractionLog((l) => [...l, id]);
          break;

        case "C_Stop":
          setHistory((h) => {
            const newHistory = [...h];
            const lastContraction = h
              .filter((h) => h.label === "Contraction")
              .pop();
            if (!lastContraction) {
              throw "trying to stop a contraction when nothing has started yet";
            }

            if (lastContraction?.startTime < 0) {
              throw "trying to stop a contraction that is still empty";
            }
            lastContraction.endTime = time;
            const changeIndex = newHistory.findIndex(
              (h) => h.id === lastContraction.id
            );
            newHistory[changeIndex] = lastContraction;
            return newHistory;
          });
          break;

        default:
          console.error("received - " + type + " - does not exist");
      }
    },
    [contractionLog]
  );

  const numContractions = contractionLog.length;
  const lastContraction: ContractionItem = useMemo(() => {
    return numContractions > 1
      ? (history.find(
          (h) => h.id === contractionLog[numContractions - 2]
        ) as ContractionItem)
      : EMPTY_CONTRACTION;
  }, [contractionLog]);

  const newContraction: ContractionItem = useMemo(() => {
    if (numContractions == 0) {
      console.log("no contractions");
      return EMPTY_CONTRACTION;
    }

    const latestContraction = history.find(
      (h) => h.id === contractionLog[numContractions - 1]
    );
    if (!latestContraction) {
      console.log("couldnt find contraction");
      return EMPTY_CONTRACTION;
    }

    return latestContraction?.startTime < 0
      ? EMPTY_CONTRACTION
      : (latestContraction as ContractionItem);
  }, [contractionLog]);

  const value: ValueOut = useMemo(() => {
    const drinkHistory =
      drinkLog.length > 0
        ? history.find((h) => h.id === drinkLog[drinkLog.length - 1])
        : EMPTY_REMINDER;
    const lastDrink = drinkHistory ? drinkHistory : EMPTY_REMINDER;

    const foodHistory =
      foodLog.length > 0
        ? history.find((h) => h.id === foodLog[foodLog.length - 1])
        : EMPTY_REMINDER;
    const lastFood = foodHistory ? foodHistory : EMPTY_REMINDER;

    const toiletHistory =
      toiletLog.length > 0
        ? history.find((h) => h.id === toiletLog[toiletLog.length - 1])
        : EMPTY_REMINDER;
    const lastToilet = toiletHistory ? toiletHistory : EMPTY_REMINDER;

    return {
      addHistoryItem,
      lastDrink,
      lastFood,
      lastToilet,
      lastContraction,
      newContraction,
      numContractions,
      startTime: "",
    };
  }, [
    addHistoryItem,
    drinkLog,
    foodLog,
    toiletLog,
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
