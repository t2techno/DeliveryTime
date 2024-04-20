import React, { useContext } from "react";
import styled from "styled-components";
import Reminder from "./Reminder";
import {
  HistoryContext,
  DispatchType,
  ReminderContext,
  ContractionContext,
} from "../../providers/HistoryProvider";
import * as Accordion from "@radix-ui/react-accordion";

const ReminderBox = ({ time }: { time: number }) => {
  const { drinkTime, foodTime, toiletTime } = React.useMemo(() => {
    const minute = 60;
    const hour = minute * 60;

    return {
      drinkTime: 15 * minute,
      foodTime: 2 * hour,
      toiletTime: 1.5 * hour,
    };
  }, []);

  const { lastDrink, lastFood, lastToilet } = useContext(ReminderContext);
  const { numContractions } = useContext(ContractionContext);
  const { addHistoryItem } = useContext(HistoryContext);

  const lastDrinkTime = Math.max(time - lastDrink.startTime, 0);
  const lastDrinkContract = numContractions - lastDrink.contraction;

  const lastFoodTime = Math.max(time - lastFood.startTime, 0);
  const lastFoodContract = numContractions - lastFood.contraction;

  const lastToiletTime = Math.max(time - lastToilet.startTime, 0);
  const lastToiletContract = numContractions - lastToilet.contraction;

  const updateHistory = React.useCallback((label: string, time: number) => {
    const id = Math.random();
    console.log(`timer ${time}`);
    console.log(`${id} - ${label} - t:${time}`);
    addHistoryItem(label as DispatchType, time, id);
  }, []);

  return (
    <Wrapper>
      <SectionHeader>How long since...</SectionHeader>
      <Root type="single" orientation="horizontal" collapsible>
        <Reminder
          label="Drink"
          highLightColor="var(--blue)"
          timeLimit={drinkTime}
          timeSince={lastDrinkTime}
          contractionLimit={4}
          contractionsSince={lastDrinkContract}
          updateValue={() => {
            updateHistory("Drink", time);
          }}
        />
        <Reminder
          label="Food"
          highLightColor="var(--red)"
          timeLimit={foodTime}
          timeSince={lastFoodTime}
          contractionLimit={50}
          contractionsSince={lastFoodContract}
          updateValue={() => {
            updateHistory("Food", time);
          }}
        />
        <Reminder
          label="Toilet"
          highLightColor="var(--gold)"
          timeLimit={toiletTime}
          timeSince={lastToiletTime}
          contractionLimit={35}
          contractionsSince={lastToiletContract}
          updateValue={() => {
            updateHistory("Toilet", time);
          }}
        />
      </Root>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  place-content: center;
`;

const Root = styled(Accordion.Root)`
  border-radius: 6px;
  width: 300px;
  /* background-color: var(); */
  box-shadow: 0 2px 10px var(--background-gray);
`;

const SectionHeader = styled.h3`
  font-size: 3rem;
  margin-bottom: 16px;
`;

export default ReminderBox;
