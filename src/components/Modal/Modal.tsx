import React, { PropsWithChildren } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styled from "styled-components";

import { XCircle } from "react-feather";

interface ModalProps {
  title: string;
  description: string;
}

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({
  children,
  title,
  description,
}) => {
  return (
    <Wrapper>
      <Dialog.Trigger>B</Dialog.Trigger>
      <Dialog.Portal>
        <Backdrop />
        <Content>
          <Title>{title}</Title>
          <Dialog.Description>{description}</Dialog.Description>
          {children}
          <Dialog.Close asChild>
            <CloseButton aria-label="Close">
              <XCircle />
            </CloseButton>
          </Dialog.Close>
        </Content>
      </Dialog.Portal>
    </Wrapper>
  );
};

const Wrapper = styled(Dialog.Root)`
  position: fixed;
  inset: 0;
  display: grid;
  place-content: center;
  padding: 16px;
`;

const Backdrop = styled(Dialog.Overlay)`
  position: absolute;
  inset: 0;
  background: hsl(0deg 0% 0% / 0.75);
`;

const Content = styled(Dialog.Content)`
  background-color: white;
  border-radius: 6px;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 450px;
  max-height: 85vh;
  padding: 25px;
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
`;

const Title = styled(Dialog.Title)`
  text-align: center;
  margin-top: -8px;
  margin-bottom: 16px;
`;

const CloseButton = styled(Dialog.Close)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 16px;
  color: white;
  transform: translateY(-100%);
  cursor: pointer;
  background: transparent;
  border: none;
`;

export default Modal;
