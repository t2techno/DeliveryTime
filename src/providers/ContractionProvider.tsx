import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type ValueOut = {
  hasStarted: boolean;
  isContracting: boolean;
  toggleContractions: (time: number) => void;
  numContractions: number;
  contractionStartTime: number;
};

interface ContractionItem {
  startTime: number;
  endTime: number;
}

const INIT_VALUE: ValueOut = {
  hasStarted: false,
  isContracting: false,
  toggleContractions: () => console.log("empty contraction toggle"),
  numContractions: 0,
  contractionStartTime: -1,
};

export const ContractionContext = createContext<ValueOut>(INIT_VALUE);

const ContractionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [isContracting, setIsContracting] = useState(false);
  const [contractionStartTime, setContractionStartTime] = useState(-1);
  const [numContractions, setNumContractions] = useState(0);
  const [contractionHistory, setContractionHistory] = useState<
    ContractionItem[]
  >([]);

  // load/save on open
  useEffect(() => {
    const KEY = "contractions";
    const savedState = window.localStorage.getItem(KEY);
    if (savedState != null) {
      setContractionHistory(JSON.parse(savedState));
    }
    return () => {
      window.localStorage.setItem(KEY, JSON.stringify(contractionHistory));
    };
  }, []);

  const toggleContractions = useCallback((time: number) => {
    setHasStarted(true);
    setIsContracting((val) => {
      // starting new contraction
      if (!val) {
        setNumContractions((num) => num + 1);
        setContractionStartTime(time);
      } else {
        setContractionHistory((history) => [
          ...history,
          { startTime: contractionStartTime, endTime: time },
        ]);
        setContractionStartTime(-1);
      }
      return !val;
    });
  }, []);

  const value = useMemo(() => {
    return {
      hasStarted,
      isContracting,
      toggleContractions,
      numContractions,
      contractionStartTime,
    };
  }, [hasStarted, isContracting, numContractions, contractionStartTime]);

  return (
    <ContractionContext.Provider value={value}>
      {children}
    </ContractionContext.Provider>
  );
};

export default ContractionProvider;
