const BaseIcon: React.FC<{ color: string; path: string; fill?: boolean }> = ({
  color,
  path,
  fill = false,
}) => {
  return (
    <svg viewBox="0 0 100 40">
      <path
        d={path}
        fill={color}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  );
};

const Saw: React.FC<{ color: string }> = ({ color }) => {
  const sawPath = `m 5 60 
                    h 25
                    v -40
                    L 70 60
                    h 25`;
  return <BaseIcon color={color} path={sawPath} />;
};

/* M 5 40 
    Q 30 75, 50 40
    T 95 40`;*/

const Sine: React.FC<{ color: string }> = ({ color }) => {
  const sinePath = `M -5 40 
  Q 30 0, 25 20
  T 50 20
  T 105 40`;
  return <BaseIcon color={color} path={sinePath} />;
};

const Square: React.FC<{ color: string }> = ({ color }) => {
  const squarePath = `m 5 40
                      h 20  v -30
                      h 25  v  60
                      h 25  v -40
                      h 20`;

  return <BaseIcon color={color} path={squarePath} />;
};

const Triangle: React.FC<{ color: string }> = ({ color }) => {
  const trianglePath = `m 5 40 h 10
                        L 35 15 L 60 65 
                        L 85 40 h 10`;

  return <BaseIcon color={color} path={trianglePath} />;
};

export { Saw, Sine, Square, Triangle };
