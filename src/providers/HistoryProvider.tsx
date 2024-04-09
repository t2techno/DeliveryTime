import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import ContractionProvider from "./ContractionProvider";
import ReminderProvider from "./ReminderProvider";

interface HistoryItem {
  label: string;
  time: number;
}

interface ValueOut {
  addHistoryItem: (label: string, time: number) => void;
}
const INIT_VALUE: ValueOut = {
  addHistoryItem: () => {
    console.log("Empty History add method");
  },
};
export const HistoryContext = createContext<ValueOut>(INIT_VALUE);

const HistoryProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const KEY = "history";
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const savedHistory = window.localStorage.getItem(KEY);
    return savedHistory != null ? JSON.parse(savedHistory) : [];
  });

  // save history to local storage
  useEffect(() => {
    window.localStorage.setItem(KEY, JSON.stringify(history));
  }, [history]);

  const addHistoryItem = useCallback((label: string, time: number) => {
    console.log(`${label} - ${time} - ${new Date().toLocaleString()}`);
    setHistory((h) => [...h, { label, time }]);
  }, []);

  return (
    <HistoryContext.Provider value={{ addHistoryItem }}>
      <ContractionProvider>
        <ReminderProvider>{children}</ReminderProvider>
      </ContractionProvider>
    </HistoryContext.Provider>
  );
};

export default HistoryProvider;
