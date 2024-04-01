import styled from "styled-components";
import { useCallback, useState } from "react";
import Modal from "../Modal";
import useTimer from "../../hooks/use-timer";
import ToggleGroup from "../ToggleGroup";
import RoundBreath from "./RoundBreath";
import FlowerBreath from "./FlowerBreath";
import { getBreathDirection } from "./breath.helpers";

const Breath = () => {
  const [isBoxBreath, setIsBoxBreath] = useState(false);
  const [isFlower, setIsFlower] = useState(true);

  const [time, toggleTimer, resetTimer, _] = useTimer();

  const handleOpen = useCallback(() => {
    toggleTimer();
  }, []);

  const handleClose = useCallback(() => {
    resetTimer();
  }, []);

  // ToDo: animation gets out of sync with display
  // Switch to spring-physics, run animation with javascript
  // keeps them in sync
  const breathDirection = getBreathDirection(time, isBoxBreath);

  const onBreathChange = (val: string) => {
    setIsBoxBreath(val === "Box");
    resetTimer();
    toggleTimer();
  };

  const onCircleChange = (val: string) => {
    setIsFlower(val === "Flower");
    resetTimer();
    toggleTimer();
  };

  return (
    <Modal
      title={isBoxBreath ? "Box Breath" : "Even Breath"}
      description="For helping you keep calm"
      handleOpen={handleOpen}
      handleClose={handleClose}
    >
      {isFlower ? (
        <FlowerBreath $isbox={isBoxBreath} />
      ) : (
        <RoundBreath $isbox={isBoxBreath} />
      )}
      <Count>
        {time}
        <br />
        {breathDirection}
      </Count>
      <BreathToggle
        label="Breath type"
        options={["Box", "Even"]}
        selected={isBoxBreath ? 0 : 1}
        onToggleChange={onBreathChange}
      />

      {/* Can probably do icons for these */}
      <CircleToggle
        label="Circle type"
        options={["Flower", "Round"]}
        selected={isFlower ? 0 : 1}
        onToggleChange={onCircleChange}
      />
    </Modal>
  );
};

const Count = styled.div`
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  position: absolute;
  top: 35%;
  left: 41%;
  width: 5rem;
`;

const BreathToggle = styled(ToggleGroup)`
  position: absolute;
  top: 5%;
  left: 5%;
`;
const CircleToggle = styled(ToggleGroup)`
  position: absolute;
  top: 5%;
  right: 5%;
`;
export default Breath;
