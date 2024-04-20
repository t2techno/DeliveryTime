import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

// ____________________ //
/*     Contractions     */
// ____________________ //
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

interface ContractionOut {
  lastContraction: ContractionItem;
  newContraction: ContractionItem;
  numContractions: number;
  avgContractionLen: number;
  avgBetweenTime: number;
}

const INIT_CONTRACT_OUT: ContractionOut = {
  lastContraction: EMPTY_CONTRACTION,
  newContraction: EMPTY_CONTRACTION,
  numContractions: 0,
  avgContractionLen: 0,
  avgBetweenTime: 0,
};

// ____________________ //
/*        Reminders     */
// ____________________ //
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

interface ReminderOut {
  lastDrink: ReminderItem;
  lastFood: ReminderItem;
  lastToilet: ReminderItem;
}

const INIT_REMINDER_OUT: ReminderOut = {
  lastDrink: EMPTY_REMINDER,
  lastFood: EMPTY_REMINDER,
  lastToilet: EMPTY_REMINDER,
};

// ____________________ //
/*        History       */
// ____________________ //
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

interface HistoryOut {
  addHistoryItem: (label: DispatchType, time: number, id: number) => void;
  startTime: string;
}

const INIT_VALUE: HistoryOut = {
  addHistoryItem: () => {
    console.log("Empty History add method");
    return 0;
  },
  startTime: "",
};

export const HistoryContext = createContext<HistoryOut>(INIT_VALUE);
export const ReminderContext = createContext<ReminderOut>(INIT_REMINDER_OUT);
export const ContractionContext =
  createContext<ContractionOut>(INIT_CONTRACT_OUT);

const HistoryProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const HIST_KEY = "history_key";
  const [history, setHistory] = useState<Array<HistoryItem>>(() => {
    const savedHistory = window.localStorage.getItem(HIST_KEY);
    return savedHistory != null ? JSON.parse(savedHistory) : [];
  });

  // list of relevant ids
  const [drinkLog, setDrinkLog] = useState<Array<number>>([]);
  const [foodLog, setFoodLog] = useState<Array<number>>([]);
  const [toiletLog, setToiletLog] = useState<Array<number>>([]);
  const [contractionLog, setContractionLog] = useState<Array<number>>([]);

  // contraction stats
  const [contractionSum, setContractionSum] = useState<number>(0);
  const [timeBetweenSum, setTimeBetweenSum] = useState<number>(0);

  // init from saved history
  useEffect(() => {
    if (history.length > 0) {
      setDrinkLog(history.filter((h) => h?.label === "Drink").map((h) => h.id));
      setFoodLog(history.filter((h) => h?.label === "Food").map((h) => h.id));
      setToiletLog(
        history.filter((h) => h?.label === "Toilet").map((h) => h.id)
      );

      const contractions = history.filter((h) => h?.label === "Contraction");
      if (contractions.length == 0) {
        return;
      }
      setContractionLog(contractions.map((c) => c.id));

      let contractSum = 0;
      contractions.forEach((c) => {
        if (c.endTime > c.startTime) {
          contractSum += c.endTime - c.startTime;
        }
      });
      setContractionSum(contractSum);

      let timeBetweenSum = 0;
      if (contractions.length > 1) {
        for (let i = 0; i < contractions.length - 1; i++) {
          timeBetweenSum +=
            contractions[i + 1].startTime - contractions[i].startTime;
        }
      }
      setTimeBetweenSum(timeBetweenSum);
    }
  }, []);

  // save history to local storage
  useEffect(() => {
    window.localStorage.setItem(HIST_KEY, JSON.stringify(history));
  }, [history]);

  // history //
  const addHistoryItem = useCallback(
    (type: DispatchType, time: number, id: number) => {
      let newHistoryItem: HistoryItem;

      if (["Drink", "Food", "Toilet"].includes(type)) {
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

        case "C_Start": {
          setHistory((h) => [...h, newHistoryItem]);
          setContractionLog((l) => [...l, id]);
          if (contractionLog.length > 0) {
            const lastContract = history.find(
              (h) => h?.id === contractionLog[contractionLog.length - 1]
            );
            setTimeBetweenSum((tbs) => {
              return lastContract ? tbs + (time - lastContract.startTime) : tbs;
            });
          }
          break;
        }

        case "C_Stop": {
          const lastContract = history
            .filter((hist) => hist.label === "Contraction")
            .pop();
          setContractionSum((sum) =>
            lastContract ? sum + (time - lastContract.startTime) : sum
          );
          setHistory((h) => {
            const newHistory = [...h];
            const lastContraction = h
              .filter((hist) => hist.label === "Contraction")
              .pop();
            if (!lastContraction) {
              throw "trying to stop a contraction when nothing has started yet";
            }

            if (lastContraction?.startTime < 0) {
              throw "trying to stop a contraction that is still empty";
            }
            lastContraction.endTime = time;
            const changeIndex = newHistory.findIndex(
              (h) => h?.id === lastContraction.id
            );
            newHistory[changeIndex] = lastContraction;
            return newHistory;
          });
          break;
        }

        default:
          console.error("received - " + type + " - does not exist");
      }
    },
    [contractionLog, history]
  );

  const historyOut: HistoryOut = useMemo(() => {
    return { addHistoryItem, startTime: "", time: 0 };
  }, [addHistoryItem]);

  // contractions //
  const numContractions = contractionLog.length;
  const lastContraction: ContractionItem = useMemo(() => {
    // check if actual last contraction an be used
    const last = history.find(
      (h) => h?.id === contractionLog[numContractions - 1]
    ) as ContractionItem;

    return last?.endTime > last?.startTime ? last : EMPTY_CONTRACTION;
  }, [contractionLog, history]);

  const newContraction: ContractionItem = useMemo(() => {
    if (numContractions == 0) {
      console.log("no contractions");
      return EMPTY_CONTRACTION;
    }

    const latestContraction = history.find(
      (h) => h?.id === contractionLog[numContractions - 1]
    );
    if (!latestContraction) {
      console.log("couldnt find contraction");
      return EMPTY_CONTRACTION;
    }

    return latestContraction?.endTime > 0
      ? EMPTY_CONTRACTION
      : (latestContraction as ContractionItem);
  }, [contractionLog, history]);

  const contractionOut: ContractionOut = useMemo(() => {
    return {
      lastContraction,
      newContraction,
      numContractions: contractionLog.length,
      avgContractionLen: contractionSum / Math.max(contractionLog.length, 1),
      avgBetweenTime: timeBetweenSum / Math.max(contractionLog.length - 1, 1),
    };
  }, [contractionLog, contractionSum, timeBetweenSum]);

  // reminders //
  const reminderOut: ReminderOut = useMemo(() => {
    const drinkHistory =
      drinkLog.length > 0
        ? history.find((h) => h?.id === drinkLog[drinkLog.length - 1])
        : EMPTY_REMINDER;
    const lastDrink = drinkHistory ? drinkHistory : EMPTY_REMINDER;

    const foodHistory =
      foodLog.length > 0
        ? history.find((h) => h?.id === foodLog[foodLog.length - 1])
        : EMPTY_REMINDER;
    const lastFood = foodHistory ? foodHistory : EMPTY_REMINDER;

    const toiletHistory =
      toiletLog.length > 0
        ? history.find((h) => h?.id === toiletLog[toiletLog.length - 1])
        : EMPTY_REMINDER;
    const lastToilet = toiletHistory ? toiletHistory : EMPTY_REMINDER;

    return { lastDrink, lastFood, lastToilet };
  }, [history, drinkLog, foodLog, toiletLog]);

  return (
    <HistoryContext.Provider value={historyOut}>
      <ContractionContext.Provider value={contractionOut}>
        <ReminderContext.Provider value={reminderOut}>
          {children}
        </ReminderContext.Provider>
      </ContractionContext.Provider>
    </HistoryContext.Provider>
  );
};

export default HistoryProvider;
