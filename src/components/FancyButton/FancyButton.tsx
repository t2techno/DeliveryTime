import styled from "styled-components";
import React, { useState } from "react";

// ToDo: make this more responsive;
const FancyButton: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <Wrapper className={className}>
      <PushableButton
        onClick={() => {
          setIsActive((isActive) => !isActive);
        }}
      >
        <ShadowSpan></ShadowSpan>
        <EdgeSpan></EdgeSpan>
        <FrontSpan>{children}</FrontSpan>
      </PushableButton>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const PushableButton = styled.button`
  position: relative;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  outline-offset: 4px;
  transition: filter 250ms;

  &:hover {
    filter: brightness(110%);
  }
  &:focus:not(:focus-visible) {
    outline: none;
  }
`;

const ShadowSpan = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: hsl(0deg 0% 0% / 0.45);
  filter: blur(4px);
  will-change: transform;
  transform: translateY(2px);
  transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);

  ${PushableButton}:hover & {
    transform: translateY(4px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
  }

  ${PushableButton}:active & {
    transform: translateY(1px);
    transition: transform 34ms;
  }
`;

const EdgeSpan = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: linear-gradient(
    to left,
    hsl(340deg 100% 16%) 0%,
    hsl(340deg 100% 32%) 8%,
    hsl(340deg 100% 32%) 92%,
    hsl(340deg 100% 16%) 100%
  );
`;

const FrontSpan = styled.span`
  display: block;
  position: relative;
  width: 7rem;
  padding: 25px;
  border-radius: 16px;
  font-size: 1.25rem;
  color: white;
  background: hsl(345deg 100% 47%);
  will-change: transform;
  transform: translateY(-4px);
  transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);

  ${PushableButton}:hover & {
    transform: translateY(-6px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
  }

  ${PushableButton}:active & {
    transform: translateY(-2px);
    transition: transform 34ms;
  }
`;

export default React.memo(FancyButton);