import React from "react";
import styled from "styled-components";
import BaseBorder from "../FancyBorder";

const Header: React.FC<{ className?: string }> = ({ className }) => {
  console.info("Header ReRender");

  return (
    <Wrapper className={className}>
      <Title>Delivery Time!</Title>
      <FancyBorder color="var(--dark-mode-background)" />
    </Wrapper>
  );
};

const Wrapper = styled.header``;

const Title = styled.h1`
  font-size: 3.5rem;
  text-align: center;
  padding-top: 1.5rem;
`;

const FancyBorder = styled(BaseBorder)`
  margin-top: -10%;
`;

export default Header;
