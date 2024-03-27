import styled from "styled-components";

const BaseIcon: React.FC<{ color: string; path: string; fill?: boolean }> = ({
  color,
  path,
  fill = true,
}) => {
  return (
    <svg viewBox="0 0 100 40">
      <path
        d={path}
        fill={fill ? color : "none"}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  );
};

const sinePath = `M 5 40 
                  Q 30 75, 50 40
                  T 95 40`;

const squigglePath = `M -10 40 
                      Q 30 0, 25 20
                      T 50 20
                      T 105 40`;

interface ColorProp {
  color: string;
}

const Sine: React.FC<ColorProp> = ({ color }) => {
  return <BaseIcon color={color} path={sinePath} />;
};

const Squiggle: React.FC<ColorProp> = ({ color }) => {
  return <BaseIcon color={color} path={squigglePath} />;
};

const legPath = `m 54, 31 
                 c 19, 
                  -5 27,
                  -5 39,7`;

const Body: React.FC<ColorProp> = ({ color }) => {
  return (
    <svg viewBox="0 0 100 40">
      <BodyPath d={squigglePath} fill={color} stroke={color} />
      <HighlightPath d={legPath} stroke="var(--text-color)" />
    </svg>
  );
};

const BodyPath = styled.path`
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3;
`;

const HighlightPath = styled.path`
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  stroke-width: 1;
  opacity: 0.05;
  filter: blur(0.5px);
`;
export { Body };
