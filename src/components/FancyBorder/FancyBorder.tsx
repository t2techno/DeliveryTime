import { Sine } from "./WaveIcons";
import styled from "styled-components";

const FancyBorder = ({ color, className }: { color: string, className?: string }) => {
  return (
    <Wrapper className={className}>
      <Sine color={color} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  overflow: hidden;
`;

export default FancyBorder;
