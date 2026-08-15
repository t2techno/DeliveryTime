import { useLiveQuery } from "dexie-react-hooks";
import db, {
  type ContractionStore,
  type EnergyStore,
  type EnergyType,
} from "./db";
import { useCallback } from "react";

interface UseDbValue {
  contractions: ContractionStore[];
  updateContraction: () => Promise<void>;
  energy: EnergyStore[];
  updateEnergy: (type: EnergyType) => Promise<void>;
}

const useDb = (): UseDbValue => {
  const contractions = useLiveQuery(() => db.contractions.toArray()) ?? [];
  console.log({ contractions });

  const energy = useLiveQuery(() => db.energy.toArray()) ?? [];

  const updateContraction = useCallback(async () => {
    const now = new Date();
    const lastContraction = contractions?.at(-1);

    try {
      // Starting new contraction
      if (
        lastContraction === undefined ||
        lastContraction.contraction.length === 2
      ) {
        await db.contractions.add({
          contraction: [now.getTime()],
        });
      } else {
        await db.contractions.update(lastContraction.id, {
          contraction: [...lastContraction.contraction, now.getTime()],
        });
      }
    } catch (err) {
      console.error("There was a problem updating the contraction store", err);
    }
  }, [contractions]);

  const updateEnergy = useCallback(async (type: EnergyType) => {
    try {
      await db.energy.add({ type, time: new Date().getTime() });
    } catch (err) {
      console.error("There was a problem updating the energy store", err);
    }
  }, []);

  return {
    contractions,
    updateContraction,
    energy,
    updateEnergy,
  };
};

export default useDb;
