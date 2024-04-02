import styled from "styled-components";
import FancyButton from "../FancyButton";
import Icon from "../Icon";
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
          <IconWrapper>
            <LabelIcon type={label} />
            <WarnIcon
              type={label}
              $warncolor={warningColor}
              $warnlevel={warnLevel}
            />
          </IconWrapper>
          <p>Time: {generateTime(timeSince)}</p>
          <p>Contractions: {contractionsSince}</p>
        </InfoDisplay>
      </InfoWrapper>

      {/* <FancyButton>+1</FancyButton> */}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: var(--background-color);
  height: 100%;
  width: 25%;
`;

const InfoWrapper = styled.div`
  width: 11.5rem;
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

const IconWrapper = styled.div`
  position: relative;
  height: 3rem;
  width: 3rem;
`;

const LabelIcon = styled(Icon)`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const WarnIcon = styled(LabelIcon)<{ $warncolor: string; $warnlevel: number }>`
  stroke: ${(p) => p.$warncolor};
  opacity: ${(p) => p.$warnlevel};
`;

export default Reminder;
