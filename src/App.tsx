import "./App.css";
import styled from "styled-components";
import BaseHeader from "./components/Header";
import BaseLaborBox from "./components/LaborBox";
import ReminderBox from "./components/ReminderBox";
import useTimer from "./hooks/use-timer";

// Large ToDo: Hospital bag/ToDo-ToGrab list
// 5 starred thing - show up whe you leave to the hospital
function App() {
  const [time, toggleTimer, resetTimer, startTime] = useTimer();

  return (
    <Wrapper>
      <MaxWidthWrapper>
        <Header />
        <LaborBox
          elapsedTime={time}
          toggleTimer={toggleTimer}
          startTime={startTime}
          resetTimer={resetTimer}
        />
        <ReminderBox elapsedTime={time} elapsedContractions={0} />
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
`;

const MaxWidthWrapper = styled.div`
  height: 100%;
  width: 100%;
  max-width: 800px;
  margin: auto;
`;

const Header = styled(BaseHeader)``;

const LaborBox = styled(BaseLaborBox)`
  margin: 16px 0;
`;

export default App;
