import React, { useContext } from "react";
import styled from "styled-components";
import Reminder from "./Reminder";
import {
  DispatchType,
  ReminderContext,
  ContractionContext,
} from "../../providers/HistoryProvider";
import * as Accordion from "@radix-ui/react-accordion";

interface ReminderBoxProps {
  time: number;
  handleAction: (label: DispatchType, time: number) => void;
}

const ReminderBox: React.FC<ReminderBoxProps> = ({ time, handleAction }) => {
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

  const lastDrinkTime = Math.max(time - lastDrink.startTime, 0);
  const lastDrinkContract = numContractions - lastDrink.contraction;

  const lastFoodTime = Math.max(time - lastFood.startTime, 0);
  const lastFoodContract = numContractions - lastFood.contraction;

  const lastToiletTime = Math.max(time - lastToilet.startTime, 0);
  const lastToiletContract = numContractions - lastToilet.contraction;

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
            handleAction("Drink", time);
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
            handleAction("Food", time);
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
            handleAction("Toilet", time);
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
