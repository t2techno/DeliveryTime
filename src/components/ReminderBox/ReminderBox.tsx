import React, { useContext } from "react";
import styled from "styled-components";
import Reminder from "./Reminder";
import { HistoryContext, HistoryType } from "../../providers/HistoryProvider";
import { ContractionContext } from "../../providers/ContractionProvider";

// ToDo: option medicine box with more specific options
const ReminderBox = ({ elapsedTime }: { elapsedTime: number }) => {
  const { drinkTime, foodTime, toiletTime } = React.useMemo(() => {
    const minute = 60;
    const hour = minute * 60;

    return {
      drinkTime: 15 * minute,
      foodTime: 2 * hour,
      toiletTime: 1.5 * hour,
    };
  }, []); // in ms

  const { numContractions } = useContext(ContractionContext);
  const { addHistoryItem, lastDrink, lastFood, lastToilet } =
    useContext(HistoryContext);

  const lastDrinkTime = Math.max(elapsedTime - lastDrink.time, 0);
  const lastDrinkContract = numContractions - lastDrink.contraction;

  const lastFoodTime = Math.max(elapsedTime - lastFood.time, 0);
  const lastFoodContract = numContractions - lastFood.contraction;

  const lastToiletTime = Math.max(elapsedTime - lastToilet.time, 0);
  const lastToiletContract = numContractions - lastToilet.contraction;

  const updateHistory = React.useCallback(
    (label: string, time: number, contraction: number) => {
      console.log(`timer ${time} - contraction ${contraction}`);
      addHistoryItem(label as HistoryType, time, contraction);
    },
    []
  );

  return (
    <Wrapper>
      <SectionHeader>How long since...</SectionHeader>
      <GridWrapper>
        <Reminder
          label="Drink"
          warningColor="var(--blue)"
          timeLimit={drinkTime}
          timeSince={lastDrinkTime}
          contractionLimit={4}
          contractionsSince={lastDrinkContract}
          updateValue={() => {
            updateHistory("Drink", elapsedTime, numContractions);
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
