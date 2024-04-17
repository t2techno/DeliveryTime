import styled, { keyframes } from "styled-components";
import * as Accordion from "@radix-ui/react-accordion";
import BaseFancyButton from "../FancyButton";
import { ChangingIcon, IconTypes } from "../Icon";
import { generateTime } from "../../utilities/time-stuff";
import { useRef, useState } from "react";

interface ReminderProps {
  label: IconTypes;
  highLightColor: string;
  timeLimit: number; // ms
  timeSince: number; // ms
  contractionLimit: number;
  contractionsSince: number;
  updateValue: () => void;
  className?: string;
}

const Reminder: React.FC<ReminderProps> = ({
  label,
  highLightColor,
  className,
  timeLimit,
  timeSince,
  contractionLimit,
  contractionsSince,
  updateValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const limitRoll = useRef(0);

  const ignoreReminder = () => {
    console.log("ignoring " + label);
    limitRoll.current += timeSince;
  };

  // timeLimit / contractionLimit for color
  const timeLevel = Math.min((timeSince + limitRoll.current) / timeLimit, 1.0);
  const contractionLevel = Math.min(contractionsSince / contractionLimit, 1.0);
  const warnLevel = Math.max(timeLevel, contractionLevel);

  return (
    <Item className={className} value={label} $highlightColor={highLightColor}>
      <ItemHeader>
        <ButtonRow>
          <FancyButton onClick={() => ignoreReminder()}>
            <ButtonContent>
              Skip{" "}
              <ChangingIcon
                type={label}
                $highlightColor={highLightColor}
                $warnlevel={warnLevel}
              />
            </ButtonContent>
          </FancyButton>
          <FancyButton
            onClick={() => {
              updateValue();
            }}
          >
            <ButtonContent>
              <p>+&nbsp;1</p>
              <ChangingIcon
                type={label}
                $highlightColor={highLightColor}
                $warnlevel={warnLevel}
              />
            </ButtonContent>
          </FancyButton>
        </ButtonRow>
        <TriggerIcon $highlightColor={highLightColor}>
          <TriggerChevron
            type={"Open"}
            $highlightColor={highLightColor}
            $warnlevel={warnLevel}
          />
        </TriggerIcon>
      </ItemHeader>
      <Content>
        <ContentText>
          <p>Time: {generateTime(timeSince)}</p>
          <p>Contractions: {contractionsSince}</p>
        </ContentText>
      </Content>
    </Item>
  );
};

const Item = styled(Accordion.Item)<{ $highlightColor: string }>`
  margin-top: 1px;
  padding: 8px;

  &:first-child {
    margin-top: 0;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  &:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  &:focus-within {
    position: relative;
    z-index: 1;
    box-shadow: 0 0 0 2px ${(p) => p.$highlightColor};
  }
`;

const ItemHeader = styled(Accordion.Header)`
  display: flex;
`;

const TriggerChevron = styled(ChangingIcon)`
  transition: transform 300ms cubic-bezier(0.87, 0, 0.13, 1);
`;

const TriggerIcon = styled(Accordion.Trigger)<{ $highlightColor: string }>`
  font-family: inherit;
  background-color: transparent;
  border: none;
  padding: 0 10px;
  height: 45px;
  font-size: 15px;
  margin-left: 1rem;
  box-shadow: 0 1px 0 ${(p) => p.$highlightColor};
  color: var(--text-color);

  &:hover {
    color: ${(p) => p.$highlightColor};
  }

  &[data-state="open"] > ${TriggerChevron} {
    transform: rotate(180deg);
  }
`;

const slideDown = keyframes`
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
`;
const slideUp = keyframes`    
  from {
    height: var(--radix-accordion-content-height);
  }
  to {
    height: 0;
  }
`;

const Content = styled(Accordion.Content)`
  overflow: hidden;
  font-size: 15px;
  color: inherit;
  background-color: var(--background-gray);

  &[data-state="open"] {
    animation: ${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1);
  }
  &[data-state="closed"] {
    animation: ${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1);
  }
`;

const ContentText = styled.div`
  padding: 15px 20px;
`;

const ButtonRow = styled.div`
  width: 100%;
  display: flex;
  gap: 0.5rem;
  justify-content: space-around;
  margin-bottom: 12px;
`;

const FancyButton = styled(BaseFancyButton)`
  margin-top: 16px;
  width: min(50%, 150px);
`;

const ButtonContent = styled.span`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
`;

export default Reminder;
