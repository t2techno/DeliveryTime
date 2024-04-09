import { memo } from "react";
import styled from "styled-components";

const Water = () => {
  return (
    <>
      <path d="M15.2 22H8.8a2 2 0 0 1-2-1.79L5 3h14l-1.81 17.21A2 2 0 0 1 15.2 22Z" />
      <path d="M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0" />
    </>
  );
};

const Apple = () => {
  return (
    <>
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
      <path d="M10 2c1 .5 2 2 2 5" />
    </>
  );
};

const Toilet = () => {
  return (
    <>
      <path d="M 1.8162986,3.6008766 H 4.1961228" />
      <path d="m 0.95257503,12.713678 c 0.0323346,3.558849 6.94211537,3.009549 6.96151617,5.651603 0.099096,2.987234 -0.6301438,6.692214 1.2231977,6.682137 H 19.616258 c 1.518964,-2.96901 -0.985239,-5.979927 0,-7.573352 1.667038,-2.092991 2.026296,-4.935327 0.26936,-4.760388 C 8.2683765,13.554809 10.720574,12.07701 10.584199,0.95257503 H 0.95257503 Z" />
    </>
  );
};

const ChevronDown = () => {
  return <polyline points="6 9 12 15 18 9"></polyline>;
};

interface Props {
  type: string;
  className?: string;
}

type IconProps = React.ComponentProps<"svg"> & Props;

const Icon: React.FC<IconProps> = ({ type, className, ...deferred }) => {
  let El = () => <p>{type}</p>;

  switch (type) {
    case "Water":
      El = Water;
      break;

    case "Food":
      El = Apple;
      break;

    case "Toilet":
      El = Toilet;
      break;

    case "Open":
      El = ChevronDown;
      break;

    default:
      console.error("invalid icon");
  }

  return (
    <Wrapper
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--text-color)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...deferred}
    >
      <El />
    </Wrapper>
  );
};

const Wrapper = styled.svg`
  height: 100%;
  min-width: 42px;
`;

export default memo(Icon);
