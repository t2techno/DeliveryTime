import styled from "styled-components";
import BaseFancyButton from "../FancyButton";
import { ChangingIcon } from "../Icon";
import { generateTime } from "../../utilities/time-stuff";
import { useState } from "react";

interface ReminderProps {
  label: string;
  warningColor: string;
  timeLimit: number; // ms
  timeSince: number; // ms
  contractionLimit: number;
  contractionsSince: number;
  updateValue: () => void;
  className?: string;
}

const Reminder: React.FC<ReminderProps> = ({
  label,
  warningColor,
  className,
  timeLimit,
  timeSince,
  contractionLimit,
  contractionsSince,
  updateValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // timeLimit / contractionLimit for color
  const timeLevel = Math.min(timeSince / timeLimit, 1.0);
  console.log(`${label} time-level: ${timeLevel}`);
  const contractionLevel = Math.min(contractionsSince / contractionLimit, 1.0);
  const warnLevel = Math.max(timeLevel, contractionLevel);
  return (
    <Wrapper className={className}>
      <InfoWrapper>
        <WarningBackground
          style={{
            backgroundColor: warningColor,
            borderColor: warningColor,
            opacity: `${warnLevel}`,
          }}
        />
        <InfoDisplay>
          <ChangingIcon
            type={label}
            $warncolor={warningColor}
            $warnlevel={warnLevel}
          />
          {isOpen ? (
            <InfoText>
              <p>Time: {generateTime(timeSince)}</p>
              <p>Contractions: {contractionsSince}</p>
            </InfoText>
          ) : undefined}
          <OpenCloseButton
            $isOpen={isOpen}
            onClick={() => {
              setIsOpen((s) => !s);
            }}
          >
            <ChangingIcon
              type={"Open"}
              $warncolor={warningColor}
              $warnlevel={warnLevel}
            />
          </OpenCloseButton>
        </InfoDisplay>
      </InfoWrapper>

      <ButtonRow>
        <FancyButton>
          <ButtonContent>
            Skip{" "}
            <ChangingIcon
              type={label}
              $warncolor={warningColor}
              $warnlevel={warnLevel}
            />
          </ButtonContent>
        </FancyButton>
        <FancyButton>
          <ButtonContent>
            <p>+&nbsp;1</p>
            <ChangingIcon
              type={label}
              $warncolor={warningColor}
              $warnlevel={warnLevel}
            />
          </ButtonContent>
        </FancyButton>
      </ButtonRow>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: var(--background-color);
  height: 100%;
  width: 100%;
`;

const InfoWrapper = styled.div`
  height: 100px;
  position: relative;
`;

const InfoDisplay = styled.div`
  background-color: var(--background-color);
  padding: 8px;
  border: solid var(--text-color) 2px;
  border-radius: 8px;
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const OpenCloseButton = styled.button<{ $isOpen: boolean }>`
  padding: 0;
  border: none;
  background-color: transparent;
  rotate: ${(p) => (p.$isOpen ? "0deg" : "180deg")};
  transition: rotate 250ms;
`;

const WarningBackground = styled.div`
  border: solid 10px;
  border-radius: 12px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  scale: 1.1;
`;

const InfoText = styled.div``;

const ButtonRow = styled.div`
  width: 100%;
  display: flex;
  gap: 0.5rem;
  justify-content: space-around;
`;

const FancyButton = styled(BaseFancyButton)`
  margin-top: 16px;
  width: min(50%, 150px);
`;

const ButtonContent = styled.span`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
`;

export default Reminder;
