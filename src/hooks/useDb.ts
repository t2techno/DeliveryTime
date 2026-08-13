import { useLiveQuery } from "dexie-react-hooks";
import db, { type EnergyType } from "../db/db";
import { useMemo } from "react";

interface UseDbValue {
  laborStart: number;
  numContractions: number;
  updateContraction: () => Promise<void>;
  lastFood: number;
  lastDrink: number;
  updateEnergy: (type: EnergyType) => Promise<void>;
}

const useDb = (): UseDbValue => {
  const contractions = useLiveQuery(() => db.contractions.toArray());
  const laborStart = useMemo(
    () =>
      contractions && contractions?.length > 0
        ? contractions[0].contraction[0]
        : 0,
    [contractions],
  );
  const numContractions = useMemo(
    () => (contractions ? contractions.length : 0),
    [contractions],
  );

  const updateContraction = async () => {
    const now = new Date();
    const lastContraction = contractions?.at(-1);

    try {
      // Either this is the first contraction or the last contraction is already complete
      if (
        lastContraction === undefined ||
        lastContraction.contraction.length === 2
      ) {
        if (!lastContraction) {
          console.log("first contraction!");
        } else {
          console.log(`contraction number ${numContractions + 1}`);
        }
        await db.contractions.add({ contraction: [now.getTime()] });
      } else {
        console.log(
          `ending contraction - id-${lastContraction.id}, num-${numContractions} - ${now.getTime()}`,
        );
        await db.contractions.update(lastContraction.id, {
          contraction: [...lastContraction.contraction, now.getTime()],
        });
      }
    } catch (err) {
      console.error("There was a problem updating the contraction store", err);
    }
  };

  const updateEnergy = async (type: EnergyType) => {
    const now = new Date();
    try {
      await db.energy.add({ type, time: now.getTime() });
    } catch (err) {
      console.error("There was a problem updating the energy store", err);
    }
  };

  const energy = useLiveQuery(() => db.energy.toArray());
  const food = energy?.filter((val) => val.type === "food");
  const lastFood = useMemo(
    () => (food && food.length > 0 ? (food?.at(-1)?.time ?? -1) : -1),
    [food],
  );

  const drink = energy?.filter((val) => val.type === "drink");
  const lastDrink = useMemo(
    () => (drink && drink.length > 0 ? (drink?.at(-1)?.time ?? -1) : -1),
    [drink],
  );
  return {
    laborStart,
    numContractions,
    updateContraction,
    lastFood,
    lastDrink,
    updateEnergy,
  };
};

export default useDb;
