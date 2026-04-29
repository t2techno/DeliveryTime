export type EnergyCategory = "food" | "drink" | "potty";

interface HumanSectionProps {
  handleEnergy: (type: EnergyCategory) => void;
  lastFood: string;
  lastDrink: string;
  lastPotty: string;
}

const HumanSection: React.FC<HumanSectionProps> = ({
  handleEnergy,
  lastFood,
  lastDrink,
  lastPotty,
}) => {
  return (
    <div>
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

        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>Last Potty: {lastPotty}</p>
          <button onClick={() => handleEnergy("potty")}>+ Potty</button>
        </div>
        {/* 
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>Next Medicine: Stuff</p>
          <p>Thing One</p>
          <p>Thing Two</p>
          <p>Thing Three</p>
        </div> 
        */}
      </div>
    </div>
  );
};

export default HumanSection;
