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

/* M 5 40 
    Q 30 75, 50 40
    T 95 40`;*/

const Sine: React.FC<{ color: string }> = ({ color }) => {
  const sinePath = `M -10 40 
  Q 30 0, 25 20
  T 50 20
  T 105 40`;
  return <BaseIcon color={color} path={sinePath} />;
};

export { Sine  };
