import React, { useContext } from "react";
import styled from "styled-components";
import Reminder from "./Reminder";
import { ReminderContext } from "../../providers/ReminderProvider";
import { ContractionContext } from "../../providers/ContractionProvider";

// ToDo: option medicine box with more specific options
const ReminderBox = ({ elapsedTime }: { elapsedTime: number }) => {
  const { waterTime, foodTime, toiletTime } = React.useMemo(() => {
    const minute = 60;
    const hour = minute * 60;

    return {
      waterTime: 15 * minute,
      foodTime: 2 * hour,
      toiletTime: 1.5 * hour,
    };
  }, []); // in ms

  const { numContractions } = useContext(ContractionContext);
  const { lastWater, lastFood, lastToilet, addReminderItem } =
    useContext(ReminderContext);

  const lastWaterTime = Math.max(elapsedTime - lastWater.elapsedTime, 0);
  const lastWaterContract = numContractions - lastWater.contraction;

  const lastFoodTime = Math.max(elapsedTime - lastFood.elapsedTime, 0);
  const lastFoodContract = numContractions - lastFood.contraction;

  const lastToiletTime = Math.max(elapsedTime - lastToilet.elapsedTime, 0);
  const lastToiletContract = numContractions - lastToilet.contraction;

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
          contractionsSince={lastWaterContract}
          updateValue={() => {
            updateHistory("Water", elapsedTime, numContractions);
          }}
        />
        <Reminder
          label="Food"
          warningColor="var(--red)"
          timeLimit={foodTime}
          timeSince={lastFoodTime}
          contractionLimit={50}
          contractionsSince={lastFoodContract}
          updateValue={() => {
            updateHistory("Food", elapsedTime, numContractions);
          }}
        />
        <Reminder
          label="Toilet"
          warningColor="var(--gold)"
          timeLimit={toiletTime}
          timeSince={lastToiletTime}
          contractionLimit={35}
          contractionsSince={lastToiletContract}
          updateValue={() => {
            updateHistory("Toilet", elapsedTime, numContractions);
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
