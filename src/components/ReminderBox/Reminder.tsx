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
      <Label>{label}</Label>
      <p>Time Since: {timeSince}</p>
      <p>Contractions Since: {contractionsSince}</p>
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

const Wrapper = styled.div`
  border: white solid 2px;
  background-color: var(--blue);
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
