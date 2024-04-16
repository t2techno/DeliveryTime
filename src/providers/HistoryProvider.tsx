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
  id: number;
  startTime: number;
  endTime: number;
}

const EMPTY_CONTRACTION: ContractionItem = {
  id: 0,
  startTime: -1,
  endTime: -2,
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
  currentContraction: ContractionItem;
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
  currentContraction: EMPTY_CONTRACTION,
};

export const HistoryContext = createContext<ValueOut>(INIT_VALUE);
const HistoryProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const KEY = "history";
  const [history, setHistory] = useState<Array<HistoryItem>>(() => {
    const savedHistory = window.localStorage.getItem(KEY);
    return savedHistory != null ? JSON.parse(savedHistory) : [];
  });

  // list of relevant ids
  const [drinkLog, setDrinkLog] = useState<Array<number>>([]);
  const [lastDrink, setLastDrink] = useState<ReminderItem>(EMPTY_REMINDER);

  const [foodLog, setFoodLog] = useState<Array<number>>([]);
  const [lastFood, setLastFood] = useState<ReminderItem>(EMPTY_REMINDER);

  const [toiletLog, setToiletLog] = useState<Array<number>>([]);
  const [lastToilet, setLastToilet] = useState<ReminderItem>(EMPTY_REMINDER);

  const [contractionLog, setContractionLog] = useState<Array<number>>([]);
  const [currentContraction, setCurrentContraction] =
    useState<ContractionItem>(EMPTY_CONTRACTION);
  const [lastContraction, setLastContraction] =
    useState<ContractionItem>(EMPTY_CONTRACTION);

  // save history to local storage
  useEffect(() => {
    window.localStorage.setItem(KEY, JSON.stringify(history));
  }, [history]);

  const addHistoryItem = useCallback(
    (label: HistoryType, time: number, contraction = 0) => {
      const id = Math.random();
      const newHistoryItem: HistoryItem = {
        id,
        label,
        time,
        contraction,
        note: "",
      };
      setHistory((h) => [...h, newHistoryItem]);

      // update type specific log
      let newLogItem;
      if (label in ["Drink", "Food", "Toilet"]) {
        newLogItem = { id, time, contraction } as ReminderItem;
      } else if (label === "C_Start") {
        newLogItem = { id, startTime: time, endTime: 0 } as ContractionItem;
      } else {
        // C_Stop
        newLogItem = {
          ...currentContraction,
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
          setContractionLog((l) => [...l, id]);
          setCurrentContraction(newLogItem as ContractionItem);
          break;

        case "C_Stop":
          setLastContraction(newLogItem as ContractionItem);
          setCurrentContraction(EMPTY_CONTRACTION);
          break;

        default:
          console.error("received - " + label + " - does not exist");
      }
    },
    []
  );

  const value: ValueOut = useMemo(() => {
    return {
      addHistoryItem,
      lastDrink,
      lastFood,
      lastToilet,
      lastContraction,
      currentContraction,
    };
  }, [lastDrink, lastFood, lastToilet, lastContraction, currentContraction]);

  return (
    <HistoryContext.Provider value={value}>
      <ContractionProvider>{children}</ContractionProvider>
    </HistoryContext.Provider>
  );
};

export default HistoryProvider;
