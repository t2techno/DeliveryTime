import { createContext } from "react";
import type { ContractionStore, EnergyType } from "./db";

export interface DbContextValue {
  laborStart: number;
  lastContraction: ContractionStore | undefined;
  numContractions: number;
  updateContraction: () => Promise<void>;
  lastFood: number;
  lastDrink: number;
  updateEnergy: (type: EnergyType) => Promise<void>;
  resetDb: () => void;
}

const emptyContextValue: DbContextValue = {
  laborStart: -1,
  lastContraction: { id: -1, start: -1 },
  numContractions: 0,
  updateContraction: async () => {
    console.error("Update Contraction method not implemented");
  },
  lastFood: -1,
  lastDrink: -1,
  updateEnergy: async () => {
    console.error("Update Energy method not implemented");
  },
  resetDb: () => {
    console.error("Reset App method not implemented");
  },
};

const DbContext = createContext<DbContextValue>(emptyContextValue);
export default DbContext;
