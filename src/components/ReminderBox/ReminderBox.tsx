import React, { useContext } from "react";
import styled from "styled-components";
import Reminder from "./Reminder";
import { ReminderContext } from "../../providers/ReminderProvider";

// ToDo: option medicine box with more specific options
const ReminderBox = ({
  elapsedTime,
  elapsedContractions,
}: {
  elapsedTime: number;
  elapsedContractions: number;
}) => {
  const { waterTime, foodTime, toiletTime } = React.useMemo(() => {
    const minute = 60;
    const hour = minute * 60;

    return {
      waterTime: 15 * minute,
      foodTime: 2 * hour,
      toiletTime: 1.5 * hour,
    };
  }, []); // in ms
  const { lastWater, lastFood, lastToilet, addReminderItem } =
    useContext(ReminderContext);

  const lastWaterTime = elapsedTime - lastWater.elapsedTime;
  const lastFoodTime = elapsedTime - lastFood.elapsedTime;
  const lastToiletTime = elapsedTime - lastToilet.elapsedTime;

  const updateHistory = React.useCallback(
    (label: string, time: number, contraction: number) => {
      console.log(`timer ${time} - contraction ${contraction}`);
      addReminderItem(label, time, contraction);
    },
    []
  );

  return (
    <Wrapper>
      <SectionHeader>How long since...</SectionHeader>
      <GridWrapper>
        <Reminder
          label="Water"
          warningColor="var(--blue)"
          timeLimit={waterTime}
          timeSince={lastWaterTime}
          contractionLimit={4}
          contractionsSince={0}
          updateValue={() => {
            updateHistory("Water", elapsedTime, elapsedContractions);
          }}
        />
        <Reminder
          label="Food"
          warningColor="var(--red)"
          timeLimit={foodTime}
          timeSince={lastFoodTime}
          contractionLimit={50}
          contractionsSince={0}
          updateValue={() => {
            updateHistory("Food", elapsedTime, elapsedContractions);
          }}
        />
        <Reminder
          label="Toilet"
          warningColor="var(--gold)"
          timeLimit={toiletTime}
          timeSince={lastToiletTime}
          contractionLimit={35}
          contractionsSince={0}
          updateValue={() => {
            updateHistory("Toilet", elapsedTime, elapsedContractions);
          }}
        />
      </GridWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const SectionHeader = styled.h3`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const GridWrapper = styled.div`
  display: grid;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
`;

export default ReminderBox;
