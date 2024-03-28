import React from "react";
import styled from "styled-components";
import { INIT_TIME } from "../../hooks/use-timer";

interface LaborBoxProps {
  className?: string;
  elapsedTime: string;
  toggleTimer: () => void;
  startTime: Date;
}

const LaborBox: React.FC<LaborBoxProps> = ({
  className,
  elapsedTime,
  toggleTimer,
  startTime,
}) => {
  return (
    <Wrapper className={className}>
      {startTime.getTime() == INIT_TIME.getTime() ? (
        <NotStarted toggleTimer={toggleTimer} />
      ) : (
        <Started elapsedTime={elapsedTime} startTime={startTime} />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border: solid var(--text-color) 2px;
  border-radius: 8px;
  padding: 16px 32px;
`;

const NotStarted = ({ toggleTimer }: { toggleTimer: () => void }) => {
  return (
    <>
      <p>Labor has not yet begun...</p>
      <button onClick={toggleTimer}>Start Contraction</button>
    </>
  );
};

const Started = ({
  elapsedTime,
  startTime,
}: {
  elapsedTime: string;
  startTime: Date;
}) => {
  return (
    <RunningWrapper>
      <LaborSection>
        <InfoLabel>Labor</InfoLabel>
        <Info>Began: {startTime.toLocaleTimeString()}</Info>
        <Info>Length: {elapsedTime}</Info>
      </LaborSection>
      <ContractionSection>
        <ContractWrapper>
          <InfoLabel>Contractions</InfoLabel>
          <Info>Number of: {0}</Info>
          <Info>Time Between: {0}</Info>
          <Info>Length of: {0}</Info>
        </ContractWrapper>
      </ContractionSection>
    </RunningWrapper>
  );
};

const RunningWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-around;
  align-items: baseline;

  @media (max-width: 625px) {
    flex-direction: column;
    align-items: center;
  }
`;

const RunningInfoSection = styled.div`
  padding: 16px 32px;
  flex: 1;
  height: 100%;
`;

const InfoLabel = styled.h3`
  font-size: 2rem;
  text-decoration: underline;
`;

const Info = styled.p`
  white-space: nowrap;
`;

const LaborSection = styled(RunningInfoSection)``;

const ContractionSection = styled(RunningInfoSection)`
  display: flex;
  justify-content: flex-end;
`;

const ContractWrapper = styled.div``;

export default LaborBox;
