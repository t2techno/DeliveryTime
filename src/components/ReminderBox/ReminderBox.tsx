import styled from "styled-components";
import Reminder from "./Reminder";

// ToDo: option medicine box with more specific options
const ReminderBox = () => {
  return (
    <Wrapper>
      <Reminder label="Water" />
      <Reminder label="Food" />
      <Reminder label="Pee" />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  gap: 8px;
`;

export default ReminderBox;
