import { createContext, useMemo, type PropsWithChildren } from "react";
import type { ContractionStore, EnergyType } from "./db";
import useDb from "./useDb";

export interface DbContextValue {
  laborStart: number;
  lastContraction: ContractionStore | undefined;
  numContractions: number;
  updateContraction: () => Promise<void>;
  lastFood: number;
  lastDrink: number;
  updateEnergy: (type: EnergyType) => Promise<void>;
}

const emptyContextValue: DbContextValue = {
  laborStart: -1,
  lastContraction: { id: -1, contraction: [] },
  numContractions: 0,
  updateContraction: async () => {
    console.error("Update Contraction method not implemented");
  },
  lastFood: -1,
  lastDrink: -1,
  updateEnergy: async () => {
    console.error("Update Energy method not implemented");
  },
};

export const DbContext = createContext<DbContextValue>(emptyContextValue);

const DbProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { contractions, updateContraction, energy, updateEnergy } = useDb();
  const laborStart = useMemo(
    () =>
      contractions && contractions?.length > 0
        ? contractions[0].contraction[0]
        : 0,
    [contractions],
  );
  const lastContraction = useMemo(() => contractions.at(-1), [contractions]);
  const numContractions = useMemo(
    () => (contractions ? contractions.length : 0),
    [contractions],
  );

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
        updateContraction,
        lastFood,
        lastDrink,
        updateEnergy,
      }}
    >
      {children}
    </DbContext.Provider>
  );
};

export default DbProvider;
