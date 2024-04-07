import styled from "styled-components";
import BaseFancyButton from "../FancyButton";
import { ChangingIcon } from "../Icon";
import { generateTime } from "../../utilities/time-stuff";

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
          <p>Time: {generateTime(timeSince)}</p>
          <p>Contractions: {contractionsSince}</p>
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
            <p>+ 1</p>
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
  height: 140px;
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

const ButtonRow = styled.div`
  width: 100%;
  display: flex;
  gap: 0.5rem;
  justify-content: space-around;
`;

const FancyButton = styled(BaseFancyButton)`
  margin-top: 16px;
  width: 40%;
`;

const ButtonContent = styled.span`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
`;

export default Reminder;
