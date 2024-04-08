import React, { PropsWithChildren } from "react";
import * as BaseToggleGroup from "@radix-ui/react-toggle-group";
import styled from "styled-components";

interface ToggleGroupProps {
  label: string;
  options: string[];
  selected: number;
  className?: string;
  onToggleChange: (val: string) => void;
}

const ToggleGroup: React.FC<PropsWithChildren<ToggleGroupProps>> = ({
  label,
  options,
  selected,
  className,
  onToggleChange,
}) => {
  return (
    <ToggleGroupWrapper
      className={className}
      type="single"
      value={options[selected]}
      onValueChange={(val: string) => {
        onToggleChange(val);
      }}
      aria-label={label}
    >
      {options.map((option, idx) => {
        return (
          <ToggleItem
            key={`toggle-item-${idx}`}
            value={option}
            aria-label={option}
          >
            {option}
          </ToggleItem>
        );
      })}
    </ToggleGroupWrapper>
  );
};

const ToggleGroupWrapper = styled(BaseToggleGroup.Root)`
  display: inline-flex;
  background-color: var(--mauve-6);
  border-radius: 4px;
  box-shadow: 0 2px 10px var(--black-a7);
`;

const ToggleItem = styled(BaseToggleGroup.Item)`
  background-color: var(--light-mode-color);
  color: var(--light-mode-text-color);
  display: flex;
  font-size: 15px;
  line-height: 1;
  align-items: center;
  justify-content: center;
  margin-left: 1px;
  padding: 8px 16px;

  &:first-child {
    margin-left: 0;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  &:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  &:hover {
    background-color: mint;
  }
  &[data-state="on"] {
    background-color: var(--dark-mode-background);
    color: var(--dark-mode-text-color);
  }
  &:focus {
    position: relative;
    box-shadow: 0 0 0 2px black;
  }
`;

export default ToggleGroup;
