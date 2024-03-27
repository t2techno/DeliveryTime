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

`;

export default FancyBorder;
