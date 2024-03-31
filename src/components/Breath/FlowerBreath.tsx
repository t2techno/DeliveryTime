import styled from "styled-components";

const NUMBER_OF_CIRCLES = 8;
const circleArray = new Array(NUMBER_OF_CIRCLES).fill(0);
const FlowerBreath = () => {
  return (
    <SVGWrapper
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {circleArray.map((_, idx) => {
        return <Petal key={idx} cx={12} cy={12} r={3} fillOpacity={0.25} />;
      })}
    </SVGWrapper>
  );
};

const SVGWrapper = styled.svg`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Petal = styled.circle`
  &:nth-of-type(1) {
    fill: red;
    transform: translate(-3px, -3px);
  }
  &:nth-of-type(2) {
    fill: green;
    transform: translate(-5px, 0px);
  }
  &:nth-of-type(3) {
    fill: blue;
    transform: translate(-3px, 3px);
  }
  &:nth-of-type(4) {
    fill: purple;
    transform: translate(0px, 6px);
  }
  &:nth-of-type(5) {
    fill: yellow;
    transform: translate(3px, -3px);
  }
  &:nth-of-type(6) {
    fill: tan;
    transform: translate(5px, 0px);
  }
  &:nth-of-type(7) {
    fill: teal;
    transform: translate(3px, 3px);
  }

  &:nth-of-type(8) {
    fill: black;
    transform: translate(0px, -6px);
  }
`;

export default FlowerBreath;
