import React, { useContext, useMemo } from "react";
import styled from "styled-components";
import FancyButton from "../FancyButton";
import { ContractionContext } from "../../providers/ContractionProvider";

interface LaborBoxProps {
  className?: string;
  elapsedTime: string;
  startTime: Date;
}

const LaborBox: React.FC<LaborBoxProps> = ({
  className,
  elapsedTime,
  startTime,
}) => {
  const {
    hasStarted,
    isContracting,
    toggleContractions,
    numContractions,
    contractionStartTime,
  } = useContext(ContractionContext);

  let buttonText = "Start First Contraction";
  if (hasStarted) {
    buttonText = isContracting ? "Stop Contraction" : "Start Contraction";
  }
  return (
    <Wrapper className={className}>
      <FlexWrapper>
        <LeftWrapper>
          <InfoLabel>Labor</InfoLabel>
          <Info>Began: {startTime.toLocaleTimeString()}</Info>
          <Info>Length: {elapsedTime}</Info>
        </LeftWrapper>
        <MainButton>{buttonText}</MainButton>
        <RightWrapper>
          <ContractionWrapper>
            <InfoLabel>Contractions</InfoLabel>
            <Info>Number of: {numContractions}</Info>
            <Info>Time Between: {0}</Info>
            <Info>Length of: {0}</Info>
          </ContractionWrapper>
        </RightWrapper>
      </FlexWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border: solid var(--text-color) 2px;
  border-radius: 8px;
  padding: 16px 32px;
`;

const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-around;

  @media (max-width: 625px) {
    flex-direction: column;
    align-items: center;
  }
`;

const LeftWrapper = styled.div`
  align-self: baseline;
  padding: 16px 32px;
  flex: 1;
  height: 100%;
`;

const RightWrapper = styled(LeftWrapper)`
  display: flex;
  justify-content: flex-end;
`;

const InfoLabel = styled.h3`
  font-size: 2rem;
  text-decoration: underline;
`;

const Info = styled.p`
  white-space: nowrap;
`;

const MainButton = styled(FancyButton)`
  flex: 1;
`;

const ContractionWrapper = styled.div``;

export default LaborBox;
