import styled from "styled-components";
import FancyButton from "../FancyButton";

interface ReminderProps {
  label: string;
  timeLimit: number; // ms
  timeSince: number; // ms
  contractionLimit: number;
  contractionsSince: number;
  updateValue: () => void;
  className?: string;
}

const Reminder: React.FC<ReminderProps> = ({
  label,
  className,
  timeLimit,
  timeSince,
  contractionLimit,
  contractionsSince,
  updateValue,
}) => {
  // timeLimit / contractionLimit for color
  return (
    <Wrapper className={className}>
      <InfoDisplay>
        <Label>Last {label}</Label>
        <p>Time: {timeSince}</p>
        <p>Contractions: {contractionsSince}</p>
      </InfoDisplay>

      <FancyButton>+1</FancyButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const InfoDisplay = styled.div`
  padding: 8px;
  border: solid var(--text-color) 2px;
  border-radius: 8px;
`;

const Label = styled.h3`
  text-align: center;
`;

export default Reminder;
