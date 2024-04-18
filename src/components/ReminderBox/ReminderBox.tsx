import React, { useContext } from "react";
import styled from "styled-components";
import Reminder from "./Reminder";
import { HistoryContext, DispatchType } from "../../providers/HistoryProvider";
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

  const { addHistoryItem, lastDrink, lastFood, lastToilet, numContractions } =
    useContext(HistoryContext);

  const lastDrinkTime = Math.max(time - lastDrink.time, 0);
  const lastDrinkContract = numContractions - lastDrink.contraction;

  const lastFoodTime = Math.max(time - lastFood.time, 0);
  const lastFoodContract = numContractions - lastFood.contraction;

  const lastToiletTime = Math.max(time - lastToilet.time, 0);
  const lastToiletContract = numContractions - lastToilet.contraction;

  const updateHistory = React.useCallback(
    (label: string, time: number, contraction: number) => {
      console.log(`timer ${time} - contraction ${contraction}`);
      addHistoryItem(label as DispatchType, time, contraction);
    },
    []
  );

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
            updateHistory("Drink", time, numContractions);
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
            updateHistory("Food", time, numContractions);
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
            updateHistory("Toilet", time, numContractions);
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
