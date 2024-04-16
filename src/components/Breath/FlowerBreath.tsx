import styled from "styled-components";
import { boxBreath, evenBreath, expand } from "./breath.helpers";

const NUMBER_OF_CIRCLES = 6;
const circleArray = new Array(NUMBER_OF_CIRCLES).fill(0);
const FlowerBreath: React.FC<{ $isbox: boolean }> = ({ $isbox }) => {
  return (
    <SVGWrapper
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      $isbox={$isbox}
    >
      {circleArray.map((_, idx) => {
        return (
          <Petal
            key={idx}
            cx={12}
            cy={12}
            r={6}
            fillOpacity={0.25}
            $isbox={$isbox}
          />
        );
      })}
    </SVGWrapper>
  );
};

const SVGWrapper = styled.svg<{ $isbox: boolean }>`
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

const Petal = styled.circle<{ $isbox: boolean }>`
  mix-blend-mode: screen;
  &:nth-of-type(even) {
    fill: hsl(var(--base-hue) 100% 50% / 0.75);
  }

  &:nth-of-type(odd) {
    fill: hsl(var(--opposite-hue) 100% 50% / 0.75);
  }

  &:nth-of-type(1) {
    animation: ${expand("0px, 0px", "0px, -4px")}
      ${(p) => (p.$isbox ? 4000 * 2 : 4000) + "ms"} alternate infinite
      ease-in-out;
  }
  &:nth-of-type(2) {
    animation: ${expand("0px, 0px", "4px, -2px")}
      ${(p) => (p.$isbox ? 4000 * 2 : 4000) + "ms"} alternate infinite
      ease-in-out;
  }
  &:nth-of-type(3) {
    animation: ${expand("0px, 0px", "4px, 2px")}
      ${(p) => (p.$isbox ? 4000 * 2 : 4000) + "ms"} alternate infinite
      ease-in-out;
  }
  &:nth-of-type(4) {
    animation: ${expand("0px, 0px", "0px, 4px")}
      ${(p) => (p.$isbox ? 4000 * 2 : 4000) + "ms"} alternate infinite
      ease-in-out;
  }
  &:nth-of-type(5) {
    animation: ${expand("0px, 0px", "-4px, 2px")}
      ${(p) => (p.$isbox ? 4000 * 2 : 4000) + "ms"} alternate infinite
      ease-in-out;
  }
  &:nth-of-type(6) {
    animation: ${expand("0px, 0px", "-4px, -2px")}
      ${(p) => (p.$isbox ? 4000 * 2 : 4000) + "ms"} alternate infinite
      ease-in-out;
  }
`;

export default FlowerBreath;
