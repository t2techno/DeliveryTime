import styled from "styled-components";
import FancyButton from "../FancyButton";
import Icon from "../Icon";

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
        <LabelIcon type={label} />
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
  height: 100%;
`;

const InfoDisplay = styled.div`
  padding: 8px;
  border: solid var(--text-color) 2px;
  border-radius: 8px;
`;

const LabelIcon = styled(Icon)`
  height: 3rem;
  width: 3rem;
`;

export default Reminder;
