import React from "react";
import { Sine } from "./WaveIcons";
import styled from "styled-components";

const FancyBorder = ({ color }: { color: string }) => {
  return (
    <Wrapper style={{ backgroundColor: undefined }}>
      <Sine color={color} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: -35%;
`;

export default React.memo(FancyBorder);
