import styled from "styled-components";

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
        <Label>Time Since Last {label}</Label>
        <p>Time: {timeSince}</p>
        <p>Contractions: {contractionsSince}</p>
      </InfoDisplay>

      <Button
        onClick={() => {
          updateValue();
        }}
      >
        +1
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const InfoDisplay = styled.div`
  padding: 8px;
  border: solid var(--text-color) 2px;
  border-radius: 8px;
`;

const Label = styled.h3`
  text-align: center;
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  color: inherit;
`;

export default Reminder;
