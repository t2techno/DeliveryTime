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
const ReminderTypes = ["Drink", "Food", "Toilet"];

interface HistoryItem {
  id: number;
  label: HistoryType;
  time: number;
  contraction: number;
  timeStamp: string;
  note: string;
}

interface ReminderItem {
  timeStamp: string;
  time: number;
  contraction: number;
}
export const EMPTY_REMINDER: ReminderItem = {
  timeStamp: "",
  time: 0,
  contraction: 0,
};

interface ValueOut {
  addHistoryItem: (
    label: HistoryType,
    time: number,
    contraction: number
  ) => void;
  lastDrink: ReminderItem;
  lastFood: ReminderItem;
  lastToilet: ReminderItem;
}
const INIT_VALUE: ValueOut = {
  addHistoryItem: () => {
    console.log("Empty History add method");
    return 0;
  },
  lastDrink: EMPTY_REMINDER,
  lastFood: EMPTY_REMINDER,
  lastToilet: EMPTY_REMINDER,
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
  // save history to local storage
  useEffect(() => {
    window.localStorage.setItem(KEY, JSON.stringify(history));
  }, [history]);

  const addHistoryItem = useCallback(
    (label: HistoryType, time: number, contraction: number) => {
      const id = Math.random();
      const timeStamp = new Date().toLocaleString();
      const newHistoryItem: HistoryItem = {
        id,
        label,
        time,
        contraction,
        timeStamp,
        note: "",
      };
      setHistory((h) => [...h, newHistoryItem]);

      // update type specific log
      let newLogItem;
      if (label in ReminderTypes) {
        newLogItem = { timeStamp, time, contraction };
      } else {
        newLogItem = label;
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

        default:
          console.error("received " + label);
          console.error("havent implemented this one yet, sorry");
      }
    },
    []
  );

  const value: ValueOut = useMemo(() => {
    return { addHistoryItem, lastDrink, lastFood, lastToilet };
  }, [lastDrink, lastFood, lastToilet]);

  return (
    <HistoryContext.Provider value={value}>
      <ContractionProvider>{children}</ContractionProvider>
    </HistoryContext.Provider>
  );
};

export default HistoryProvider;
