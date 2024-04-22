import styled from "styled-components";
import BaseHeader from "./components/Header";
import BaseLaborBox from "./components/LaborBox";
import ReminderBox from "./components/ReminderBox";
import useTimer, { TIME_KEY } from "./hooks/use-timer";
import { useContext, useEffect, useState } from "react";
import { HistoryContext, DispatchType } from "./providers/HistoryProvider";

function App() {
  const { time, isRunning, startTimer } = useTimer();
  const { addHistoryItem } = useContext(HistoryContext);
  const [startTime, setStartTime] = useState("");

  useEffect(() => {
    const savedTime = window.localStorage.getItem(TIME_KEY);
    if (!savedTime) {
      return;
    }
    const timeDif = (new Date().getTime() - Number.parseInt(savedTime)) / 1000;
    console.log("previously saved time found: " + timeDif + " seconds ago");
    const ogTime = new Date();
    ogTime.setTime(Number.parseInt(savedTime));
    setStartTime(ogTime.toLocaleString());
    startTimer(timeDif);
  }, []);

  const handleAction = (label: DispatchType, time: number) => {
    if (!isRunning) {
      setStartTime(new Date().toLocaleString());
      startTimer();
    }
    const id = Math.random();
    addHistoryItem(label, time, id);
  };
  return (
    <Wrapper>
      <MaxWidthWrapper>
        <Header />
        <LaborBox time={time} handleAction={handleAction} startTime={startTime}/>
        <ReminderBox time={time} handleAction={handleAction} />
      </MaxWidthWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  min-height: 100%;
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
