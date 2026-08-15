import { Dexie, type EntityTable } from "dexie";

const DB_VERSION = 1;

interface ContractionStore {
  id: number;
  contraction: Array<number>;
}

type EnergyType = "food" | "drink";
// Todo: Could add optional descriptor eg. honey stick
interface EnergyStore {
  id: number;
  type: EnergyType;
  time: number;
}

const db = new Dexie("ContractionTimerDatabase") as Dexie & {
  contractions: EntityTable<ContractionStore, "id">;
  energy: EntityTable<EnergyStore, "id">;
};

db.version(DB_VERSION).stores({
  contractions: "++id, contraction",
  energy: "++id, type, time",
});

export type { ContractionStore, EnergyStore, EnergyType };

export default db;
