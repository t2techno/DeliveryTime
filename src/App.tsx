import "./App.css";
import styled from "styled-components";
import BaseHeader from "./components/Header";
import LaborBox from "./components/LaborBox";
import useTimer from "./hooks/use-timer";

function App() {

  const [time, toggleTimer, startTime] = useTimer();

  return (
    <Main>
      <MaxWidthWrapper>
        <Header />
        <LaborBox timeElapsed={time} startLabor={() => {toggleTimer()}} startTime={startTime} />
      </MaxWidthWrapper>
    </Main>
  );
}

const Main = styled.main`
  height: 100%;
  width: 100%;
  background-color: var(--dark-mode-background);
  color: var(--dark-mode-text-color);
`;

const MaxWidthWrapper = styled.body`
  height: 100%;
  width: 100%;
  max-width: 800px;
  margin: auto;
`;

const Header = styled(BaseHeader)``;

export default App;
