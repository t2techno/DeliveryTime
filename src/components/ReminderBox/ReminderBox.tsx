import React, { useState } from "react";
import styled from "styled-components";
import Reminder from "./Reminder";
import { generateTime } from "../../utilities/time-stuff";

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

  const [waterHistory, setWaterHistory] = useState<Array<HistoryItem>>([]);
  let lastWater = elapsedTime;
  if (waterHistory.length > 0) {
    lastWater -= waterHistory[waterHistory.length - 1]?.time;
  }

  const [foodHistory, setFoodHistory] = useState<Array<HistoryItem>>([]);
  let lastFood = elapsedTime;
  if (foodHistory.length > 0) {
    lastFood -= foodHistory[foodHistory.length - 1]?.time;
  }

  const [toiletHistory, setToiletHistory] = useState<Array<HistoryItem>>([]);

  let lastToilet = elapsedTime;
  if (toiletHistory.length > 0) {
    lastToilet -= toiletHistory[toiletHistory.length - 1]?.time;
  }

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
      <SectionHeader>How long since...</SectionHeader>
      <FlexWrapper>
        <Reminder
          label="Water"
          timeLimit={waterTime}
          timeSince={generateTime(lastWater)}
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
          timeSince={generateTime(lastFood)}
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
          timeSince={generateTime(lastToilet)}
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
      </FlexWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const SectionHeader = styled.h3`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const FlexWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-between;
`;

export default ReminderBox;
