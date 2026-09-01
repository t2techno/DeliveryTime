import { createContext } from "react";
import type { ContractionStore, EnergyType } from "./db";

export interface ContractionStats {
  numContractions: number;
  lastFullContractionLength: number;
  avgContractionLength: number;
  timeBetweenLastTwoContractions: number;
  avgTimeBetweenContractions: number;
}
export interface DbContextValue {
  laborStart: number;
  lastContraction?: ContractionStore;
  stats: ContractionStats;
  updateContraction: () => Promise<void>;
  lastFood: number;
  lastDrink: number;
  updateEnergy: (type: EnergyType) => Promise<void>;
  resetDb: () => void;
}

const emptyContextValue: DbContextValue = {
  laborStart: -1,
  stats: {
    numContractions: 0,
    lastFullContractionLength: 0,
    avgContractionLength: 0,
    timeBetweenLastTwoContractions: 0,
    avgTimeBetweenContractions: 0,
  },
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
