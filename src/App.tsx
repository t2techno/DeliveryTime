import "./App.css";
import styled from "styled-components";
import BaseHeader from "./components/Header";
import LaborBox from "./components/LaborBox";
import useTimer from "./hooks/use-timer";

function App() {

  const [time, toggleTimer, startTime] = useTimer();

  return (
    <Wrapper>
      <MaxWidth>
        <Header />
        <LaborBox timeElapsed={time} startLabor={() => {toggleTimer()}} startTime={startTime} />
      </MaxWidth>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  height: 100%;
  width: 100%;
  background-color: var(--dark-mode-background);
  color: var(--dark-mode-text-color);
`;

const MaxWidth = styled.div`
  border: var(--dark-mode-text-color) solid 1px;
  max-width: 480px;
  height: 100%;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
`;

const Header = styled(BaseHeader)`
  height: 35%;
`;

export default App;
