import React, { useContext, useState } from "react";
import styled from "styled-components";
import BaseBorder from "../FancyBorder";
import { ThemeContext } from "../../Providers/ThemeProvider";

const Header: React.FC<{ className?: string }> = ({ className }) => {
  console.info("Header ReRender");
  const { color, setColor } = useContext(ThemeContext);
  const [showColor, setShowColor] = useState(false);

  return (
    <Wrapper className={className}>
      <ColorChangeButton
        onClick={() => {
          setShowColor((color) => !color);
        }}
      >
        <Title>Delivery Time!</Title>
      </ColorChangeButton>
      {showColor && (
        <input
          type="number"
          value={color}
          onChange={(event) =>
            setColor(Number.parseInt(event.target.value) % 360)
          }
        />
      )}
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

const ColorChangeButton = styled.button`
  display: block;
  margin: auto;
  border: none;
  color: var(--dark-mode-text-color);
  background-color: transparent;
`;

export default Header;
