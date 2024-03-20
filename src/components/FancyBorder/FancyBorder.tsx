import { Squiggle } from "./WaveIcons";
import styled from "styled-components";

const FancyBorder = ({
  color,
  className,
}: {
  color: string;
  className?: string;
}) => {
  return (
    <Wrapper className={className}>
      <Squiggle color={color} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-image: linear-gradient(
    var(--dark-mode-background) 0%,
    var(--gray-one) 97%,
    var(--dark-mode-background) 98%
  );
`;

export default FancyBorder;
