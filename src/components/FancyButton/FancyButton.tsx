import styled from "styled-components";
import React, { ComponentProps } from "react";

type FancyButtonProps = React.PropsWithChildren<{ className?: string }> &
  ComponentProps<"button">;

const FancyButton: React.FC<FancyButtonProps> = ({
  children,
  className,
  ...delegated
}) => {
  return (
    <Wrapper className={className}>
      <PushableButton {...delegated}>
        <ShadowSpan></ShadowSpan>
        <EdgeSpan></EdgeSpan>
        <FrontSpan>{children}</FrontSpan>
      </PushableButton>
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const PushableButton = styled.button`
  width: 100%;
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
    hsl(var(--base-hue) 50% 5%) 0%,
    hsl(var(--base-hue) 50% 32%) 8%,
    hsl(var(--base-hue) 50% 32%) 92%,
    hsl(var(--base-hue) 50% 5%) 100%
  );
`;

const FrontSpan = styled.span`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 25px;
  border-radius: 16px;
  font-size: 1.25rem;
  color: var(--text-color);
  background: hsl(var(--base-hue) 50% 15%);
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
