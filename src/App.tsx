import styled from "styled-components";
import BaseHeader from "./components/Header";
import BaseLaborBox from "./components/LaborBox";
import ReminderBox from "./components/ReminderBox";
import useTimer from "./hooks/use-timer";

function App() {
  const { time, toggleTimer, startTime } = useTimer();
  return (
    <Wrapper>
      <MaxWidthWrapper>
        <Header />
        <LaborBox time={time} startTime={startTime} startTimer={toggleTimer} />
        <ReminderBox time={time} />
      </MaxWidthWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  height: 100%;
  width: 100%;
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: 1.5rem;
  overflow: auto;
`;

const MaxWidthWrapper = styled.div`
  height: 100%;
  width: 100%;
  max-width: 800px;
  margin: auto;
  padding: 16px;
`;

const Header = styled(BaseHeader)``;

const LaborBox = styled(BaseLaborBox)`
  margin: 16px 0;
`;

export default App;
