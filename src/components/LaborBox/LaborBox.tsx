import React, { useContext } from "react";
import styled from "styled-components";
import FancyButton from "../FancyButton";
import { HistoryContext } from "../../providers/HistoryProvider";
import { ContractionContext } from "../../providers/ContractionProvider";
import { generateTime } from "../../utilities/time-stuff";

interface LaborBoxProps {
  className?: string;
  time: number;
  startTime: Date;
  startTimer: () => void;
}

const LaborBox: React.FC<LaborBoxProps> = ({
  className,
  time,
  startTime,
  startTimer,
}) => {
  const { currentContraction } = useContext(HistoryContext);
  const {
    toggleContraction,
    numContractions,
    avgContractionLen,
    avgTimeBetween,
  } = useContext(ContractionContext);
  const hasStarted = numContractions > 0;

  let buttonText = "Start First Contraction";
  if (hasStarted) {
    buttonText =
      currentContraction.startTime < currentContraction.endTime
        ? "Stop Contraction"
        : "Start Contraction";
  }
  return (
    <Wrapper className={className}>
      <FlexWrapper>
        {hasStarted && (
          <LeftWrapper>
            <InfoLabel>Labor</InfoLabel>
            <Info>Began: {startTime.toLocaleTimeString()}</Info>
            <Info>Length: {generateTime(time)}</Info>
          </LeftWrapper>
        )}
        <MainButton
          onClick={() => {
            if (!hasStarted) {
              startTimer();
            }
            toggleContraction(time);
          }}
        >
          {buttonText}
        </MainButton>
        {hasStarted && (
          <RightWrapper>
            <ContractionWrapper>
              <InfoLabel>Contractions</InfoLabel>
              <Info>
                Number of: <InfoNumber>{numContractions}</InfoNumber>
              </Info>
              <Info>
                Time Between: <InfoNumber>{avgTimeBetween}</InfoNumber>
              </Info>
              <Info>
                Length of: <InfoNumber>{avgContractionLen}</InfoNumber>
              </Info>
            </ContractionWrapper>
          </RightWrapper>
        )}
      </FlexWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  border: solid var(--text-color) 2px;
  border-radius: 8px;
  padding-top: 32px;
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

const InfoNumber = styled.span`
  /* float: right; */
`;

const MainButton = styled(FancyButton)`
  flex: 1;
  max-width: 250px;
`;

const ContractionWrapper = styled.div``;

export default LaborBox;
