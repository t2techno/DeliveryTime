import React from "react";
import styled from "styled-components";
import Icon from ".";

interface ChangingIconProps {
  type: string;
  $warncolor: string;
  $warnlevel: number;
}

export const ChangingIcon: React.FC<ChangingIconProps> = ({
  type,
  $warncolor,
  $warnlevel,
}) => {
  return (
    <IconWrapper>
      <LabelIcon type={type} />
      <WarnIcon type={type} $warncolor={$warncolor} $warnlevel={$warnlevel} />
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

const WarnIcon = styled(LabelIcon)<{ $warncolor: string; $warnlevel: number }>`
  stroke: ${(p) => p.$warncolor};
  opacity: ${(p) => p.$warnlevel};
`;

export default ChangingIcon;