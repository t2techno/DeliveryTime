import {
  PropsWithChildren,
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";

type ContractionOut = {
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

const INIT_CONTEXT_VAL: ContractionOut = {
  hasStarted: false,
  isContracting: false,
  toggleContractions: () => console.log("empty Contraction toggle"),
  numContractions: 0,
  contractionStartTime: -1,
};

const ContractionContext = createContext<ContractionOut>(INIT_CONTEXT_VAL);

const ContractionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [isContracting, setIsContracting] = useState(false);
  const [contractionStartTime, setContractionStartTime] = useState(-1);
  const [numContractions, setNumContractions] = useState(0);
  const [contractionHistory, setContractionHistory] = useState<
    ContractionItem[]
  >([]);

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

  const valueOut = useMemo(() => {
    return {
      hasStarted,
      isContracting,
      toggleContractions,
      numContractions,
      contractionStartTime,
    };
  }, [hasStarted, isContracting, numContractions, contractionStartTime]);

  return (
    <ContractionContext.Provider value={valueOut}>
      {children}
    </ContractionContext.Provider>
  );
};

export default ContractionProvider;