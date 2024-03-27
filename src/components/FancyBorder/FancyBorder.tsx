import { Body } from "./WaveIcons";
import styled from "styled-components";

const FancyBorder = ({ className }: { className?: string }) => {
  return (
    <Wrapper className={className}>
      <Body color={"var(--background-color)"} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-image: linear-gradient(
    var(--background-color) 0%,
    var(--gray-one) 97%,
    var(--background-color) 98%
  );
`;

export default FancyBorder;
