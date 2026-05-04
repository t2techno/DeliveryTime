import Card from "../Card";

export type EnergyCategory = "food" | "drink";

interface HumanSectionProps {
  handleEnergy: (type: EnergyCategory) => void;
  lastFood: string;
  lastDrink: string;
}

const HumanSection: React.FC<HumanSectionProps> = ({
  handleEnergy,
  lastFood,
  lastDrink,
}) => {
  return (
    <Card>
      <h3>Energy Info</h3>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>Last Food: {lastFood}</p>
          <button onClick={() => handleEnergy("food")}>+Food</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>Last Drink: {lastDrink}</p>
          <button onClick={() => handleEnergy("drink")}>+ Drink</button>
        </div>
      </div>
    </Card>
  );
};

export default HumanSection;
