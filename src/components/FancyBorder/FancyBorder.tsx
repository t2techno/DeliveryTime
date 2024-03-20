import React from "react";
import { Sine } from "./WaveIcons";
import styled from "styled-components";

const FancyBorder = ({ color }: { color: string }) => {
  return (
    <Wrapper>
      <Sine color={color} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-image: linear-gradient(
    var(--dark-mode-background) 0%,
    var(--gray-one) 97%,
    var(--dark-mode-background) 98%
  );
  height: fit-content;
`;

export default React.memo(FancyBorder);
