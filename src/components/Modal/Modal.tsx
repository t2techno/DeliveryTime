import React, { PropsWithChildren } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styled, { keyframes } from "styled-components";

import { XCircle } from "react-feather";

interface ModalProps {
  title: string;
  description: string;
  handleOpen: () => void;
  handleClose: () => void;
}

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({
  children,
  title,
  description,
  handleOpen,
  handleClose,
}) => {
  return (
    <Wrapper>
      <Dialog.Trigger
        onClick={() => {
          handleOpen();
        }}
      >
        B
      </Dialog.Trigger>
      <Dialog.Portal>
        <Backdrop />
        <Content>
          <Title>{title}</Title>
          <Dialog.Description>{description}</Dialog.Description>
          {children}
          <Dialog.Close asChild>
            <CloseButton
              aria-label="Close"
              onClick={() => {
                handleClose();
              }}
            >
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

const overlayShow = keyframes`
from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
`;

// ToDo: Change animations to be tranform
const Backdrop = styled(Dialog.Overlay)`
  position: absolute;
  inset: 0;
  background: hsl(0deg 0% 0% / 0.75);
  animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
`;

const contentShow = keyframes`    
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
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
  width: min(92vw, 450px);
  height: min(85vw, 250px);
  padding: 25px;
  animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
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
