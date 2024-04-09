import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { HistoryContext } from "./HistoryProvider";

interface ReminderItem {
  timeStamp: string;
  elapsedTime: number;
  contraction: number;
}
export const EMPTY_REMINDER: ReminderItem = {
  timeStamp: "",
  elapsedTime: 0,
  contraction: 0,
};

interface ValueOut {
  lastWater: ReminderItem;
  lastFood: ReminderItem;
  lastToilet: ReminderItem;
  addReminderItem: (label: string, time: number, contraction: number) => void;
}
const INIT_VALUE: ValueOut = {
  lastWater: EMPTY_REMINDER,
  lastFood: EMPTY_REMINDER,
  lastToilet: EMPTY_REMINDER,
  addReminderItem: () => {
    console.log("empty add reminder");
  },
};
export const ReminderContext = createContext<ValueOut>(INIT_VALUE);

const ReminderProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { addHistoryItem } = useContext(HistoryContext);

  const wKEY = "water";
  const [water, setWater] = useState<ReminderItem[]>(() => {
    const savedWater = window.localStorage.getItem(wKEY);
    return savedWater != null ? JSON.parse(savedWater) : [];
  });

  const fKEY = "food";
  const [food, setFood] = useState<ReminderItem[]>(() => {
    const savedFood = window.localStorage.getItem(fKEY);
    return savedFood != null ? JSON.parse(savedFood) : [];
  });

  const tKEY = "toilet";
  const [toilet, setToilet] = useState<ReminderItem[]>(() => {
    const savedToilet = window.localStorage.getItem(tKEY);
    return savedToilet != null ? JSON.parse(savedToilet) : [];
  });

  // save water
  useEffect(() => {
    window.localStorage.setItem(wKEY, JSON.stringify(water));
  }, [water]);

  // save food
  useEffect(() => {
    window.localStorage.setItem(fKEY, JSON.stringify(food));
  }, [food]);

  // save toilet
  useEffect(() => {
    window.localStorage.setItem(tKEY, JSON.stringify(toilet));
  }, [toilet]);
  
  const addReminderItem = useCallback(
    (label: string, time: number, contraction: number) => {
      // history log
      addHistoryItem(label, time);
      const now = new Date();

      switch (label) {
        case "Water":
          setWater((w) => [
            ...w,
            {
              timeStamp: now.toLocaleString(),
              elapsedTime: time,
              contraction: contraction,
            },
          ]);
          break;
        case "Food":
          setFood((f) => [
            ...f,
            {
              timeStamp: now.toLocaleString(),
              elapsedTime: time,
              contraction: contraction,
            },
          ]);
          break;
        case "Toilet":
          setToilet((t) => [
            ...t,
            {
              timeStamp: now.toLocaleString(),
              elapsedTime: time,
              contraction: contraction,
            },
          ]);
          break;
        default:
          break;
      }
    },
    []
  );

  const value = useMemo(() => {
    return {
      lastWater: water.length > 0 ? water[water.length - 1] : EMPTY_REMINDER,
      lastFood: food.length > 0 ? food[food.length - 1] : EMPTY_REMINDER,
      lastToilet:
        toilet.length > 0 ? toilet[toilet.length - 1] : EMPTY_REMINDER,
      addReminderItem: addReminderItem,
    };
  }, [water, food, toilet]);

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  );
};

export default ReminderProvider;
