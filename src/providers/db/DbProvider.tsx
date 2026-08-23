import { useContext, useMemo, type PropsWithChildren } from "react";
import useDb from "./useDb";
import DbContext from "./DbContext";
import {
  getContractionLength,
  getLastFullContractionLength,
  getTimeBetween,
} from "../../utilities/utilities";
import SettingsContext from "../settings/SettingsContext";

const DbProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { contractions, updateContraction, energy, updateEnergy, resetDb } =
    useDb();
  const { avgSize } = useContext(SettingsContext);

  const laborStart = useMemo(
    () =>
      contractions && contractions?.length > 0 ? contractions[0].start : 0,
    [contractions],
  );
  const lastContraction = useMemo(() => contractions.at(-1), [contractions]);
  const numContractions = useMemo(
    () => (contractions ? contractions.length : 0),
    [contractions],
  );

  const lastFullContractionLength = useMemo(
    () => getLastFullContractionLength(contractions && contractions),
    [contractions],
  );

  const avgContractionLength = useMemo(() => {
    // initial case, no contractions yet
    if (!contractions || !contractions[0].end) {
      return "--:--";
    }

    const trimmedContractions = contractions[contractions.length - 1].end
      ? contractions
      : contractions.slice(0, -1);

    // a value of 0 internally means we're going to avg all values
    return avgSize === 0
      ? trimmedContractions.reduce(
          (avg, contraction) =>
            avg + getContractionLength(contraction) / contractions.length,
          0,
        )
      : trimmedContractions
          .slice(-1 * avgSize)
          .reduce(
            (avg, contraction) =>
              avg + getContractionLength(contraction) / avgSize,
            0,
          );
  }, [avgSize, contractions]);

  const timeBetweenLastTwoContractions = useMemo(() => {
    getTimeBetween(contractions.at(-1), contractions.at(-2));
  }, [contractions]);

  const food = useMemo(
    () => energy?.filter((val) => val.type === "food") ?? [],
    [energy],
  );
  const lastFood = useMemo(
    () => (food && food.length > 0 ? (food?.at(-1)?.time ?? -1) : -1),
    [food],
  );

  const drink = useMemo(
    () => energy?.filter((val) => val.type === "drink") ?? [],
    [energy],
  );
  const lastDrink = useMemo(
    () => (drink && drink.length > 0 ? (drink?.at(-1)?.time ?? -1) : -1),
    [drink],
  );

  return (
    <DbContext.Provider
      value={{
        laborStart,
        numContractions,
        lastContraction,
        lastFullContractionLength,
        timeBetweenLastTwoContractions,
        updateContraction,
        lastFood,
        lastDrink,
        updateEnergy,
        resetDb,
      }}
    >
      {children}
    </DbContext.Provider>
  );
};

export default DbProvider;
