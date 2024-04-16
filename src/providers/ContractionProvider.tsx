import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { HistoryContext } from "./HistoryProvider";

interface ValueOut {
  toggleContraction: (time: number) => void;
  numContractions: number;
  avgContractionLen: number;
  avgTimeBetween: number;
}

const INIT_VALUE: ValueOut = {
  toggleContraction: () => console.log("empty contraction toggle"),
  numContractions: 0,
  avgContractionLen: 0,
  avgTimeBetween: 0,
};

export const ContractionContext = createContext<ValueOut>(INIT_VALUE);

const ContractionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const {
    addHistoryItem,
    lastContraction,
    currentContraction /*, initWithSavedHistory*/,
  } = useContext(HistoryContext);
  const [numContractions, setNumContractions] = useState(0);
  const [avgContractionLen, setAvgContractionLen] = useState(0);
  const [avgTimeBetween, setAvgTimeBetween] = useState(0);

  // load/save on open
  useEffect(() => {}, []);

  const toggleContraction = (time: number) => {
    // starting contraction
    if (currentContraction.startTime < 0) {
      addHistoryItem("C_Start", time);
      const timeBetween =
        lastContraction.startTime < 0 ? 0 : time - lastContraction.startTime;

      // first time - both are 0
      // second time - just s is 0
      // third onward - average current with new
      setAvgTimeBetween((s) =>
        timeBetween == 0 || s == 0 ? timeBetween : (s + timeBetween) / 2
      );

      setNumContractions((s) => s + 1);
    }

    // ending contraction
    else {
      addHistoryItem("C_Stop", time);
      const contractionLength = time - currentContraction.startTime;

      // might need to change this moving average
      setAvgContractionLen((state) =>
        state == 0 ? contractionLength : (state + contractionLength) / 2
      );
    }
  };

  const value = useMemo(() => {
    return {
      toggleContraction,
      numContractions,
      avgContractionLen,
      avgTimeBetween,
    };
  }, [numContractions, avgContractionLen, avgTimeBetween]);

  return (
    <ContractionContext.Provider value={value}>
      {children}
    </ContractionContext.Provider>
  );
};

export default ContractionProvider;
