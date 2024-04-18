import React from "react";
import styled from "styled-components";
import Icon, { IconTypes } from ".";

interface ChangingIconProps {
  type: IconTypes;
  $highlightColor: string;
  $warnlevel: number;
  className?: string;
}

export const ChangingIcon: React.FC<ChangingIconProps> = ({
  type,
  $highlightColor,
  $warnlevel,
  className,
}) => {
  return (
    <IconWrapper className={className}>
      <LabelIcon type={type} />
      <LabelIcon
        type={type}
        stroke={$highlightColor}
        opacity={$warnlevel ? $warnlevel : 0}
      />
    </IconWrapper>
  );
};

const IconWrapper = styled.div`
  position: relative;
  height: 3rem;
  width: 3rem;
`;

const LabelIcon = styled(Icon)`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export default ChangingIcon;
