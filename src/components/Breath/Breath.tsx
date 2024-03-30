import styled, { keyframes } from "styled-components";
import { useCallback, useState } from "react";
import Modal from "../Modal";
import useTimer from "../../hooks/use-timer";

type CircleType = "round" | "flower";

const Breath = () => {
  const [isBoxBreath, setIsBoxBreath] = useState(true);
  const [circleType, setCircleType] = useState<CircleType>("round");

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
  let breathDirection = time % 8 < 4 ? "In" : "Out";
  if (isBoxBreath) {
    const state = time % 16;
    if (state < 4) {
      breathDirection = "In";
    } else if (state < 8) {
      breathDirection = "Hold";
    } else if (state < 12) {
      breathDirection = "Out";
    } else {
      breathDirection = "Hold";
    }
  }

  return (
    <Modal
      title="Breath"
      description="For helping you keep calm"
      handleOpen={handleOpen}
      handleClose={handleClose}
    >
      <RoundBreath isBox={isBoxBreath} />
      <Count>
        {time}
        <br />
        {breathDirection}
      </Count>
    </Modal>
  );
};

const Count = styled.p`
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  display: block;
`;

export default Breath;

const RoundBreath: React.FC<{ isBox: boolean }> = ({ isBox }) => {
  return (
    <SvgWrapper
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      isBox={isBox}
    >
      <BreathCircle
        cx={12}
        cy={12}
        r={12}
        fill="var(--background-color)"
        fillOpacity={0.5}
      />
    </SvgWrapper>
  );
};

const evenBreath = keyframes`    
  from {
    transform: scale(0.3);
  }

  to {
    transform: scale(1.25);
  }
`;

const boxBreath = keyframes`
  // in
  0% {
    transform: scale(0.3);
  }

  25% {
    transform: scale(1.05);
  }

  // hold
  40% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05)
  }

  // out
  75% {
    transform: scale(0.3);
  }
  // hold
  90% {
    transform: scale(0.35);
  }
`;

const SvgWrapper = styled.svg<{ isBox: boolean }>`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: scale(0.3);
  animation: ${(p) => (p.isBox ? boxBreath : evenBreath)}
    ${(p) => (p.isBox ? 4000 * 4 : 4000) + "ms"}
    ${(p) => (p.isBox ? "" : "alternate")} infinite ease-in-out;
`;

const BreathCircle = styled.circle`
  height: 100%;
  width: 100%;
`;
