import "./App.css";
import styled from "styled-components";
import BaseHeader from "./components/Header";
import LaborBox from "./components/LaborBox";
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
        <ReminderBox />
      </MaxWidthWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  height: 100%;
  width: 100%;
  background-color: var(--dark-mode-background);
  color: var(--dark-mode-text-color);
`;

const MaxWidthWrapper = styled.div`
  height: 100%;
  width: 100%;
  max-width: 800px;
  margin: auto;
`;

const Header = styled(BaseHeader)``;

export default App;
