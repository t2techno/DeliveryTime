import React, { useState } from "react";
import styled from "styled-components";
import Reminder from "./Reminder";

interface HistoryItem {
  time: number;
  contraction: number;
}

// ToDo: option medicine box with more specific options
const ReminderBox = ({
  elapsedTime,
  elapsedContractions,
}: {
  elapsedTime: number;
  elapsedContractions: number;
}) => {
  const { waterTime, foodTime, toiletTime } = React.useMemo(() => {
    const minute = 1000 * 60;
    const hour = minute * 60;

    return {
      waterTime: 15 * minute,
      foodTime: 2 * hour,
      toiletTime: 1.5 * hour,
    };
  }, []); // in ms

  // ToDo: Use Icon instead of label to save space
  const [waterHistory, setWaterHistory] = useState<Array<HistoryItem>>([]);
  const [foodHistory, setFoodHistory] = useState<Array<HistoryItem>>([]);
  const [toiletHistory, setToiletHistory] = useState<Array<HistoryItem>>([]);

  const updateHistory = React.useCallback(
    (
      label: string,
      time: number,
      contraction: number,
      setter: React.Dispatch<React.SetStateAction<HistoryItem[]>>
    ) => {
      console.log(`timer ${time} - contraction ${contraction}`);
      setter((state) => {
        if (state.length > 0) {
          console.log(
            `updating ${label} - ${state[state.length - 1]?.time + 1}`
          );
        }
        return [...state, { time, contraction }];
      });
    },
    []
  );

  return (
    <Wrapper>
      <Reminder
        label="Water"
        timeLimit={waterTime}
        timeSince={elapsedTime}
        contractionLimit={4}
        contractionsSince={0}
        updateValue={() => {
          updateHistory(
            "Water",
            elapsedTime,
            elapsedContractions,
            setWaterHistory
          );
        }}
      />
      <Reminder
        label="Food"
        timeLimit={foodTime}
        timeSince={elapsedTime}
        contractionLimit={50}
        contractionsSince={0}
        updateValue={() => {
          updateHistory(
            "Food",
            elapsedTime,
            elapsedContractions,
            setFoodHistory
          );
        }}
      />
      <Reminder
        label="Toilet"
        timeLimit={toiletTime}
        timeSince={elapsedTime}
        contractionLimit={35}
        contractionsSince={0}
        updateValue={() => {
          updateHistory(
            "Toilet",
            elapsedTime,
            elapsedContractions,
            setToiletHistory
          );
        }}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-around;
`;

export default ReminderBox;
