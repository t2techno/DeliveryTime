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

const Sine: React.FC<{ color: string }> = ({ color }) => {
  return <BaseIcon color={color} path={sinePath} />;
};

const Squiggle: React.FC<{ color: string }> = ({ color }) => {
  return <BaseIcon color={color} path={squigglePath} />;
};

const Prego: React.FC<{ color: string }> = ({ color }) => {
  return (
    <svg viewBox="0 0 100 40">
      <defs>
        <radialGradient id="bellyButton">
          <stop offset="0%" stopColor={color} />
          <stop offset="35%" stopColor="var(--gray-one)" />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
        <radialGradient id="nipple">
          <stop offset="0%" stopColor="var(--gray-one)" />
          <stop offset="75%" stopColor={color} />
          <stop offset="100%" stopColor="var(--gray-one)" />
        </radialGradient>
      </defs>
      <path
        d={squigglePath}
        fill={color}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
      <circle opacity={0.35} fill={"url('#nipple')"} cx="24" cy="14" r="2" />
      <circle
        opacity={0.5}
        fill={"url('#bellyButton')"}
        cx="70"
        cy="14"
        r="2"
      />
    </svg>
  );
};

export { Prego };
