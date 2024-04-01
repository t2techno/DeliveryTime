import React from "react";
import styled from "styled-components";
import { evenBreath, boxBreath } from "./breath.helpers";

const RoundBreath: React.FC<{ $isbox: boolean }> = ({ $isbox }) => {
  return (
    <SvgWrapper
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      $isbox={$isbox}
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

const SvgWrapper = styled.svg<{ $isbox: boolean }>`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: scale(0.3);
  animation: ${(p) => (p.$isbox ? boxBreath : evenBreath)}
    ${(p) => (p.$isbox ? 4000 * 4 : 4000) + "ms"}
    ${(p) => (p.$isbox ? "" : "alternate")} infinite ease-in-out;
`;

const BreathCircle = styled.circle`
  height: 100%;
  width: 100%;
`;

export default RoundBreath;
