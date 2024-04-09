import React from "react";
import styled from "styled-components";
import Icon from ".";

interface ChangingIconProps {
  type: string;
  $warncolor: string;
  $warnlevel: number;
  className?: string;
}

export const ChangingIcon: React.FC<ChangingIconProps> = ({
  type,
  $warncolor,
  $warnlevel,
  className,
}) => {
  return (
    <IconWrapper className={className}>
      <LabelIcon type={type} />
      <LabelIcon type={type} stroke={$warncolor} opacity={$warnlevel} />
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
