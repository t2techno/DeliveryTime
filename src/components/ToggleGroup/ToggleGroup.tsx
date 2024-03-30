import React, { PropsWithChildren } from "react";

interface ToggleGroupProps {
  title: string;
  description: string;
  handleOpen: () => void;
  handleClose: () => void;
}

const ToggleGroup: React.FC<PropsWithChildren<ToggleGroupProps>> = ({}) => {
  return <></>;
};

export default ToggleGroup;
